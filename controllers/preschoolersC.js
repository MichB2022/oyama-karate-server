const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all preschoolers
// @route     GET /api/v1/preschooler
// @access    Public
exports.getPreschooler = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Preschooler';

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

// @desc      Create new preschooler
// @route     POST /api/v1/preschooler
// @access    Private
exports.createPreschooler = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Preschooler SET ?';

  req.body.id = uuid.v1().split('-').join('');

  if (req.files) {
    const firstImg = req.files.firstImg;
    const secondImg = req.files.secondImg;
    const thirdImg = req.files.thirdImg;

    const files = [firstImg, secondImg, thirdImg];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`,
      req.params.id,
      files
    );

    req.body = {
      ...req.body,
      firstImgUrl: firstImg?.name || '',
      secondImgUrl: secondImg?.name || '',
      thirdImgUrl: thirdImg?.name || '',
      firstImgAlt: req.body?.firstImgAlt || '',
      secondImgAlt: req.body?.secondImgAlt || '',
      thirdImgAlt: req.body?.thirdImgAlt || ''
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

// @desc      Update preschooler
// @route     PUT /api/v1/preschooler/:id
// @access    Private
exports.updatePreschooler = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Preschooler WHERE id='${req.params.id}'`;

  const preschooler = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Preschooler not found', 404));
      }

      resolve(result[0]);
    });
  });

  if (req.files) {
    const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`;
    deleteFiles([
      `${filePath}${preschooler.firstImgUrl || 'photo'}`,
      `${filePath}${preschooler.secondImgUrl || 'photo'}`,
      `${filePath}${preschooler.thirdImgUrl || 'photo'}`
    ]);

    const firstImg = req.files.firstImg;
    const secondImg = req.files.secondImg;
    const thirdImg = req.files.thirdImg;

    checkIfFileIsImage([firstImg, secondImg, thirdImg]);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`,
      req.params.id,
      [firstImg, secondImg, thirdImg]
    );

    req.body = {
      ...req.body,
      firstImgUrl: firstImg.name,
      secondImgUrl: secondImg.name,
      thirdImgUrl: thirdImg.name,
      firstImgAlt: req.body.firstImgAlt,
      secondImgAlt: req.body.secondImgAlt,
      thirdImgAlt: req.body.thirdImgAlt
    };
  }

  sql = `UPDATE Preschooler SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete preschooler
// @route     DELETE /api/v1/preschooler/:id
// @access    Private
exports.deletePreschooler = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Preschooler WHERE id='${req.params.id}'`;
  const preschooler = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Preschooler not found', 404));
      }

      resolve(result);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`;
  deleteFiles([
    `${filePath}${preschooler[0].firstImgUrl || 'photo'}`,
    `${filePath}${preschooler[0].secondImgUrl || 'photo'}`,
    `${filePath}${preschooler[0].thirdImgUrl || 'photo'}`
  ]);

  sql = `DELETE FROM Preschooler WHERE id='${req.params.id}'`;
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

// @desc      Upload photos for preschooler
// @route     PUT /api/v1/preschooler/:id/photo
// @access    Private
exports.preschoolerPhotoUpload = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Preschooler WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Preschooler not found', 404));
      }

      resolve();
    });
  });

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const firstImg = req.files.firstImg;
  const secondImg = req.files.secondImg;
  const thirdImg = req.files.thirdImg;

  checkIfFileIsImage([firstImg, secondImg, thirdImg]);
  uploadFiles(
    `${process.env.FILE_UPLOAD_PATH}/photos/preschooler/`,
    req.params.id,
    [firstImg, secondImg, thirdImg]
  );

  const queryParams = {
    firstImgUrl: firstImg.name,
    secondImgUrl: secondImg.name,
    thirdImgUrl: thirdImg.name,
    firstImgAlt: req.body.firstImgAlt,
    secondImgAlt: req.body.secondImgAlt,
    thirdImgAlt: req.body.thirdImgAlt
  };

  sql = `UPDATE Preschooler SET ? WHERE id='${req.params.id}'`;

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
