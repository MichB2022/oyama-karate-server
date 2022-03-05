const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const db = require('../utils/db');

// Schedule

// @desc      Get schedule by id
// @route     GET /api/v1/schedule/:id
// @access    Public
exports.getScheduleById = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Schedule WHERE id='${req.params.id}'`;

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

// @desc      Get all schedules
// @route     GET /api/v1/schedule
// @access    Public
exports.getAllSchedules = asyncHandler(async (req, res, next) => {
  let sql = 'SELECT * FROM Schedule';

  const schedules = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve(result);
    });
  });

  const reqBody = { schedules: [] };
  for (const schedule of schedules) {
    sql = `SELECT * FROM ScheduleRow WHERE scheduleId='${schedule.id}'`;

    const scheduleRows = await new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          return next(new ErrorResponse(err, 500));
        }

        resolve(result);
      });
    });

    reqBody.schedules.push({ ...schedule, rows: scheduleRows });
  }

  res.status(201).json({
    success: true,
    count: schedules.length,
    data: reqBody
  });
});

// @desc      Get all schedules names
// @route     GET /api/v1/schedule/names
// @access    Public
exports.getAllSchedulesNames = asyncHandler(async (req, res, next) => {
  let sql = 'SELECT * FROM Schedule';

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

// @desc      Create new schedule
// @route     POST /api/v1/schedule/add
// @access    Private
exports.createSchedule = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Schedule SET ?';
  const scheduleId = uuid.v1().split('-').join('');
  let reqBody = {};
  req.body.id = scheduleId;

  db.queryWithParams(sql, req.body, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    reqBody = {
      ...req.body,
      result: { ...result }
    };

    res.status(201).json({
      success: true,
      data: reqBody
    });
  });
});

// @desc      Update schedule
// @route     PUT /api/v1/schedule/:id
// @access    Private
exports.updateSchedule = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Schedule WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Schedule not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE Schedule SET ? WHERE id='${req.params.id}'`;
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

// @desc      Delete schedule
// @route     DELETE /api/v1/schedule/:id
// @access    Private
exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Schedule WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Schedule not found', 404));
      }

      resolve(result);
    });
  });

  sql = `DELETE FROM ScheduleRow WHERE scheduleId='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve();
    });
  });

  sql = `DELETE FROM Schedule WHERE id='${req.params.id}'`;
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

// Schedule Row

// @desc      Get all schedule rows
// @route     GET /api/v1/schedule/row/all
// @access    Public
exports.getAllScheduleRows = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM ScheduleRow';

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

// @desc      Get schedule row by id
// @route     GET /api/v1/schedule/row/single/:id
// @access    Public
exports.getScheduleRowById = asyncHandler(async (req, res, next) => {
  const sql = `SELECT * FROM ScheduleRow WHERE id='${req.params.id}'`;

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

// @desc      Get all schedule rows for schedule
// @route     GET /api/v1/schedule/row/:id
// @access    Public
exports.getAllScheduleRowsForSection = asyncHandler(async (req, res, next) => {
  const sql = `SELECT * FROM ScheduleRow WHERE scheduleId='${req.params.id}'`;

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

// @desc      Create new schedule
// @route     POST /api/v1/schedule/row/add
// @access    Private
exports.createScheduleRow = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO ScheduleRow SET ?';
  const scheduleRowId = uuid.v1().split('-').join('');
  let reqBody = {};
  req.body.id = scheduleRowId;

  db.queryWithParams(sql, req.body, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    reqBody = {
      ...req.body,
      result: { ...result }
    };

    res.status(201).json({
      success: true,
      data: reqBody
    });
  });
});

// @desc      Update schedule
// @route     PUT /api/v1/schedule/row/:id
// @access    Private
exports.updateScheduleRow = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM ScheduleRow WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Schedule Row not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE ScheduleRow SET ? WHERE id='${req.params.id}'`;
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

// @desc      Delete schedule
// @route     DELETE /api/v1/schedule/row/:id
// @access    Private
exports.deleteScheduleRow = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM ScheduleRow WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Schedule Row not found', 404));
      }

      resolve(result);
    });
  });

  sql = `DELETE FROM ScheduleRow WHERE id='${req.params.id}'`;
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
