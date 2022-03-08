const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Category ORDER BY itemOrder';

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  };

  db.query(sql, resolve);
});

// @desc      Create new category
// @route     POST /api/v1/categories
// @access    Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Category SET ?';
  req.body.id = uuid.v1().split('-').join('');

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: req.body
    });
  };

  db.queryWithParams(sql, req.body, resolve);
});

// @desc      Delete Category
// @route     DELETE /api/v1/categories/:id
// @access    Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const sql = `DELETE FROM Category WHERE id='${req.params.id}'`;

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: {}
    });
  };

  db.query(sql, resolve);
});
