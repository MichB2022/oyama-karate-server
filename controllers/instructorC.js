const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all instructors
// @route     GET /api/v1/instructors
// @access    Public
exports.getInstructors = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Instructor';

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

// @desc      Get instructor
// @route     GET /api/v1/instructors/:id
// @access    Public
exports.getInstructor = asyncHandler(async (req, res, next) => {
  const sql = `SELECT * FROM Instructor WHERE id='${req.params.id}'`;

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

// @desc      Create new instructor
// @route     POST /api/v1/instructors
// @access    Private
exports.createInstructor = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Instructor SET ?';

  req.body.id = uuid.v1().split('-').join('');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`,
      req.params.id,
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

// @desc      Update instructor
// @route     PUT /api/v1/instructors/:id
// @access    Private
exports.updateInstructor = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Instructor WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Instructor not found', 404));
      }

      resolve();
    });
  });

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`,
      req.params.id,
      files
    );

    req.body = {
      ...req.body,
      imgUrl: img?.name || '',
      imgAlt: req.body?.imgAlt || ''
    };
  }

  sql = `UPDATE Instructor SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete instructor
// @route     DELETE /api/v1/instructors/:id
// @access    Private
exports.deleteInstructor = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Instructor WHERE id='${req.params.id}'`;
  const instructor = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Instructor not found', 404));
      }

      resolve(result[0]);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/instructors/`;
  deleteFiles([`${filePath}${instructor.imgUrl} || 'photo'`]);

  sql = `DELETE FROM Instructor WHERE id='${req.params.id}'`;
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

// @desc      Upload photos for instructor
// @route     PUT /api/v1/instructors/:id/photo
// @access    Private
exports.instructorPhotoUpload = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Instructor WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Instructor not found', 404));
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
    `${process.env.FILE_UPLOAD_PATH}/photos/instructors/`,
    req.params.id,
    [img]
  );

  const queryParams = {
    imgUrl: img.name,
    imgAlt: req.body.imgAlt
  };

  sql = `UPDATE Instructor SET ? WHERE id='${req.params.id}'`;

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
