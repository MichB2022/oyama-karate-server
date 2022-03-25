const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all homepage
// @route     GET /api/v1/homepage
// @access    Public
exports.getHomepage = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Homepage';

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

// @desc      Get contact
// @route     GET /api/v1/homepage/contact
// @access    Public
exports.getContact = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT phone, email FROM Homepage';

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

// @desc      Get defaultPageDescription
// @route     GET /api/v1/homepage/decription
// @access    Public
exports.getDescription = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT defaultPageDescription FROM Homepage';

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

// @desc      Create new homepage
// @route     POST /api/v1/homepage
// @access    Private
exports.createHomepage = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Homepage SET ?';

  req.body.id = uuid.v1().split('-').join('');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/homepage/`,
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

// @desc      Update homepage
// @route     PUT /api/v1/homepage/:id
// @access    Private
exports.updateHomepage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Homepage WHERE id='${req.params.id}'`;

  const homepage = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Homepage not found', 404));
      }

      resolve(result[0]);
    });
  });

  if (req.files) {
    const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/homepage/`;
    deleteFiles([`${filePath}${homepage.imgUrl || 'photo'}`]);

    const img = req.files.img;

    checkIfFileIsImage([img]);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/homepage/`,
      req.params.id,
      [img]
    );

    req.body = {
      ...req.body,
      imgUrl: img.name,
      imgAlt: req.body.imgAlt
    };
  }

  sql = `UPDATE Homepage SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete homepage
// @route     DELETE /api/v1/homepage/:id
// @access    Private
exports.deleteHomepage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Homepage WHERE id='${req.params.id}'`;
  const homepage = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Homepage not found', 404));
      }

      resolve(result);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/homepage/`;
  deleteFiles([`${filePath}${homepage[0].imgUrl || 'photo'}`]);

  sql = `DELETE FROM Homepage WHERE id='${req.params.id}'`;
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

// @desc      UpdateOrder
// @route     POST /api/v1/homepage/updateorder
// @access    Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let sql = '';
  let i = 1;
  for (const id of req.body.ids) {
    sql = `UPDATE ${req.body.table} SET ? WHERE id='${id}'`;
    const data = {
      orderNum: i
    };
    await new Promise((resolve, reject) => {
      db.queryWithParams(sql, data, (err, result) => {
        if (err) {
          return next(new ErrorResponse(err, 500));
        }
        resolve();
      });
    });
    i++;
  }

  res.status(201).json({
    success: true,
    data: {}
  });
});
