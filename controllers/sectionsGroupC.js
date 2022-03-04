const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const db = require('../utils/db');

// Sections Group

// @desc      Get all sections groups
// @route     GET /api/v1/sectionsgroup
// @access    Public
exports.getSectionsGroup = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM SectionsGroup';

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

// @desc      Create new section group
// @route     POST /api/v1/sectionsgroup
// @access    Private
exports.createSectionsGroup = asyncHandler(async (req, res, next) => {
  let sql = 'INSERT INTO SectionsGroup SET ?';
  const sectionsGroupId = uuid.v1().split('-').join('');
  let reqBody = {};
  req.body.id = sectionsGroupId;

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    reqBody = {
      ...reqBody,
      ...req.body,
      result: { ...result }
    };

    res.status(201).json({
      success: true,
      data: reqBody
    });
  };

  db.queryWithParams(sql, req.body, resolve);
});

// @desc      Update section group
// @route     POST /api/v1/sectionsgroup/:id
// @access    Private
exports.updateSectionsGroup = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM SectionsGroup WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Section Group not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE SectionsGroup SET ? WHERE id='${req.params.id}'`;
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

// @desc      Delete sections group
// @route     DELETE /api/v1/sectionsgroup/:id
// @access    Private
exports.deleteSectionsGroup = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM SectionsGroup WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Section Group not found', 404));
      }

      resolve(result);
    });
  });

  sql = `SELECT * FROM SectionsGroupSchedule WHERE sectionsGroupId='${req.params.id}'`;
  const schedules = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve(result);
    });
  });

  sql = `DELETE FROM SectionsGroupSchedule WHERE sectionsGroupId='${req.params.id}'`;
  if (schedules) {
    await new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return next(new ErrorResponse(err, 500));
        }

        resolve();
      });
    });
  }

  sql = `DELETE FROM SectionsGroup WHERE id='${req.params.id}'`;
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

//SectionsGroupSchedule

// @desc      Get all sections groups schedule
// @route     GET /api/v1/sectionsgroup/schedule
// @access    Public
exports.getSectionsGroupSchedule = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM SectionsGroupSchedule';

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

// @desc      Create new section group schedule
// @route     POST /api/v1/sectionsgroup/schedule
// @access    Private
exports.createSectionsGroupSchedule = asyncHandler(async (req, res, next) => {
  let sql = 'INSERT INTO SectionsGroupSchedule SET ?';
  const sectionsGroupScheduleId = uuid.v1().split('-').join('');
  let reqBody = {};
  req.body.id = sectionsGroupScheduleId;

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    reqBody = {
      ...req.body,
      sectionGroupId: req.params.sectionGroupId,
      result: { ...result }
    };

    res.status(201).json({
      success: true,
      data: reqBody
    });
  };

  db.queryWithParams(sql, req.body, resolve);
});

// @desc      Update section group schedul;e
// @route     POST /api/v1/sectionsgroup/schedule/:id
// @access    Private
exports.updateSectionsGroupSchedule = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM SectionsGroupSchedule WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Section Group Schedule not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE SectionsGroupSchedule SET ? WHERE id='${req.params.id}'`;
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

// @desc      Delete sections group schedule
// @route     DELETE /api/v1/sectionsgroup/schedule/:id
// @access    Private
exports.deleteSectionsGroupSchedule = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM SectionsGroupSchedule WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Section Group Schedule not found', 404));
      }

      resolve(result);
    });
  });

  sql = `DELETE FROM SectionsGroupSchedule WHERE id='${req.params.id}'`;
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
