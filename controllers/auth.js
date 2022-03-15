const crypto = require('crypto');
const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const uuid = require('uuid');
const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc      Login user
// @route     POST /api/v1/auth/authorize
// @access    Public
exports.authorize = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    authorized: true
  });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { login, password } = req.body;

  // Validate emil & password
  if (!login || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  let sql = `SELECT * FROM User WHERE login='${login}'`;
  const user = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('User not found', 404));
      }

      resolve(result[0]);
    });
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('oyamaKarateEuToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Update password
// @route     POST /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM User WHERE id='${req.body.id}'`;
  const user = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('User not found', 404));
      }

      resolve(result[0]);
    });
  });

  // Check current password
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  const salt = await bcrypt.genSalt(10);
  req.body = { password: await bcrypt.hash(req.body.password, salt) };

  sql = `UPDATE User SET ? WHERE id='${req.params.id}'`;
  db.queryWithParams(sql, req.body, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    sendTokenResponse(user, 200, res);
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('oyamaKarateEuToken', token, options).json({
    success: true,
    token
  });
};
