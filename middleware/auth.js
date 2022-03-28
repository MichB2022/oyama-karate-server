const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const db = require('../utils/db');
const { ErrorResponse, returnErr } = require('../utils/errorResponse');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.oyamaKarateEuToken) {
    token = req.cookies.oyamaKarateEuToken;
  }

  console.log('cookies', req.cookies);

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let sql = `SELECT * FROM User WHERE id='${decoded.id}'`;
    const user = await new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return next(
            new ErrorResponse('Not authorized to access this route', 401)
          );
        } else if (!result.length) {
          return next(
            new ErrorResponse('Not authorized to access this route', 401)
          );
        }

        resolve(result);
      });
    });

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
