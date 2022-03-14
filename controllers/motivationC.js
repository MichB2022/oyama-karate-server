const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all motivations
// @route     GET /api/v1/motivation
// @access    Public
exports.getMotivation = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Motivation';

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

// @desc      Upload New Motivation Image
// @route     POST /api/v1/motivation/image
// @access    Private
exports.uploadMotivationImage = asyncHandler(async (req, res, next) => {
  req.body.id = uuid.v1().split('-').join('');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/motivation/`,
      req.body.id,
      files
    );

    req.body = {
      ...req.body,
      url: img?.name || '',
      alt: 'image'
    };

    const sql = 'INSERT INTO Motivation SET ?';
    db.queryWithParams(sql, req.body, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }
      res.status(201).json({
        success: true,
        data: {
          url: `/motivation/${req.body.url}`,
          alt: req.body.alt
        }
      });
    });
  }
});

// @desc      Delete Galery Image
// @route     DELETE /api/v1/galery/image/:id
// @access    Private
exports.deleteGaleryImage = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Motivation WHERE id='${req.params.id}'`;
  const image = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve(result[0]);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/motivation/`;
  deleteFiles([`${filePath}${image.url}` || 'photo']);

  sql = `DELETE FROM Motivation WHERE id='${req.params.id}'`;
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
