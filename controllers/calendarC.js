const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all calendar
// @route     GET /api/v1/calendar
// @access    Public
exports.getCalendars = asyncHandler(async (req, res, next) => {
  let where = '';
  if (req.query.title && req.query.filterByCategory) {
    where = `WHERE c.title LIKE '%${req.query.title}%' AND c.eventCategoryId='${req.query.filterByCategory}'`;
  } else if (req.query.title) {
    where = `WHERE c.title LIKE '%${req.query.title}%'`;
  } else if (req.query.filterByCategory) {
    where = `WHERE c.eventCategoryId='${req.query.filterByCategory}'`;
  }
  let sql = 'SELECT * FROM Calendar';
  const calendarEvents = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve(result);
    });
  });

  if (req.query.page && req.query.perpage) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.perpage, 10) || 4;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    sql = `SELECT c.*, ca.name as categoryName FROM Calendar c INNER JOIN EventCategory ca ON c.eventCategoryId=ca.id ${where} ORDER BY c.startDate LIMIT ${limit} OFFSET ${startIndex}`;

    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      res.status(201).json({
        success: true,
        count: result.length,
        pagination: {
          currentPage: page,
          perPage: limit,
          pagesCount: Math.ceil(calendarEvents.length / limit)
        },
        data: result || []
      });
    });
  } else {
    sql = `SELECT c.*, ca.name as categoryName FROM Calendar c INNER JOIN EventCategory ca ON c.eventCategoryId=ca.id ${where} ORDER BY c.startDate`;

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
  }
});

// @desc      Get all calendar
// @route     GET /api/v1/calendar/:id
// @access    Public
exports.getCalendarById = asyncHandler(async (req, res, next) => {
  const sql = `SELECT c.*, ca.name as categoryName FROM Calendar c INNER JOIN EventCategory ca ON c.eventCategoryId=ca.id WHERE c.id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: result[0]
    });
  });
});

// @desc      Create new calendar
// @route     POST /api/v1/calendar
// @access    Private
exports.createCalendar = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Calendar SET ?';

  req.body.id = uuid.v1().split('-').join('');
  req.body.startDate = new Date(req.body.startDate)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  req.body.endDate = new Date(req.body.endDate)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/calendar/`,
      req.body.id,
      files
    );

    req.body = {
      ...req.body,
      imgUrl: img?.name || '',
      imgAlt: req.body?.imgAlt || ''
    };
  }

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

// @desc      Update calendar
// @route     PUT /api/v1/calendar/:id
// @access    Private
exports.updateCalendar = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Calendar WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Calendar not found', 404));
      }

      resolve();
    });
  });

  req.body.startDate = new Date(req.body.startDate)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  req.body.endDate = new Date(req.body.endDate)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/calendar/`,
      req.params.id,
      files
    );

    req.body = {
      ...req.body,
      imgUrl: img?.name || '',
      imgAlt: req.body?.imgAlt || ''
    };
  }

  sql = `UPDATE Calendar SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete calendar
// @route     DELETE /api/v1/calendar/:id
// @access    Private
exports.deleteCalendar = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Calendar WHERE id='${req.params.id}'`;
  const calendar = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Calendar not found', 404));
      }

      resolve(result);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/calendar/`;
  deleteFiles([`${filePath}${calendar[0].img || 'photo'}`]);

  sql = `DELETE FROM Calendar WHERE id='${req.params.id}'`;
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

// @desc      Upload photos for calendar
// @route     PUT /api/v1/calendar/:id/photo
// @access    Private
exports.calendarPhotoUpload = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Calendar WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Calendar not found', 404));
      }

      resolve();
    });
  });

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const img = req.files.img;

  checkIfFileIsImage([img]);
  uploadFiles(
    `${process.env.FILE_UPLOAD_PATH}/photos/calendar/`,
    req.params.id,
    [img]
  );

  const queryParams = {
    imgUrl: img.name,
    imgAlt: req.body.imgAlt
  };

  sql = `UPDATE Calendar SET ? WHERE id='${req.params.id}'`;

  db.queryWithParams(sql, queryParams, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    res.status(201).json({
      success: true,
      data: result
    });
  });
});
