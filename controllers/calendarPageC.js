const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get calendarPage
// @route     GET /api/v1/calendarpage
// @access    Public
exports.getCalendarPage = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM CalendarPage';

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      count: result.length,
      data: result[0]
    });
  });
});

// @desc      Create new calendar page
// @route     POST /api/v1/calendarpage
// @access    Private
exports.createCalendarPage = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO CalendarPage SET ?';

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

// @desc      Update calendarPage
// @route     POST /api/v1/calendarpage/:id
// @access    Private
exports.updateCalendarPage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM CalendarPage WHERE id='${req.params.id}'`;

  const preschooler = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('CalendarPage not found', 404));
      }

      resolve(result[0]);
    });
  });

  sql = `UPDATE CalendarPage SET ? WHERE id='${req.params.id}'`;

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
