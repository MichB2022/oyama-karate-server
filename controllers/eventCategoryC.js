const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all event categories
// @route     GET /api/v1/eventcategories
// @access    Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM EventCategory';

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  });
});

// @desc      Create new event category
// @route     POST /api/v1/eventcategories
// @access    Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO EventCategory SET ?';
  req.body.id = uuid.v1().split('-').join('');

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

// @desc      Delete Event Category
// @route     DELETE /api/v1/eventcategories/:id
// @access    Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const sql = `DELETE FROM EventCategory WHERE id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: {}
    });
  });
});
