const { ErrorResponse } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const sql = `SELECT login, name, email FROM User WHERE id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    } else if (!result.length) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(201).json({
      success: true,
      data: result[0] || {}
    });
  });
});

// @desc      Create user
// @route     PUT /api/v1/auth/users/
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO User SET ?';

  req.body.id = uuid.v1().split('-').join('');
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  db.queryWithParams(sql, req.body, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: req.body
    });
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM User WHERE id='${req.params.id}'`;
  const user = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('User not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE User SET ? WHERE id='${req.params.id}'`;

  db.queryWithParams(sql, req.body, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: req.body
    });
  });
});
