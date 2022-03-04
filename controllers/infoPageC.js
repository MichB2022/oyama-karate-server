const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all info pages labels
// @route     GET /api/v1/infopages
// @access    Public
exports.getInfoPagesLabels = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT id, title FROM InfoPage';

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

// @desc      Get info page
// @route     GET /api/v1/infopages/:id
// @access    Public
exports.getInfoPage = asyncHandler(async (req, res, next) => {
  const sql = `SELECT * FROM InfoPage WHERE id='${req.params.id}'`;

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

// @desc      Create new info page
// @route     POST /api/v1/infopages
// @access    Private
exports.createInfoPage = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO InfoPage SET ?';

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

// @desc      Update info page
// @route     PUT /api/v1/infopages/:id
// @access    Private
exports.updateInfoPage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM InfoPage WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Info Page not found', 404));
      }

      resolve();
    });
  });

  sql = `UPDATE InfoPage SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete info page
// @route     DELETE /api/v1/infopages/:id
// @access    Private
exports.deleteInfoPage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM InfoPage WHERE id='${req.params.id}'`;
  const infoPage = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Info Page not found', 404));
      }

      resolve(result);
    });
  });

  sql = `DELETE FROM InfoPage WHERE id='${req.params.id}'`;
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
