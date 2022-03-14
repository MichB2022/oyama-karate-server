const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all galeries
// @route     GET /api/v1/galery
// @access    Public
exports.getGaleries = asyncHandler(async (req, res, next) => {
  const sql = 'SELECT * FROM Galery';

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

// @desc      Get Galery
// @route     GET /api/v1/galery/:id
// @access    Public
exports.getGalery = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Galery WHERE id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    }

    const response = { ...result[0] };

    sql = `SELECT * FROM GaleryImages WHERE galeryId='${result[0].id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      res.status(201).json({
        success: true,
        count: result.length,
        data: {
          ...response,
          images: result
        }
      });
    });
  });
});

// @desc      Create new galery
// @route     POST /api/v1/galery
// @access    Private
exports.createGalery = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Galery SET ?';

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

// @desc      Update galery
// @route     PUT /api/v1/galery/:id
// @access    Private
exports.updateGalery = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Galery WHERE id='${req.params.id}'`;

  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Galery not found', 404));
      }

      resolve(result[0]);
    });
  });

  sql = `UPDATE Galery SET ? WHERE id='${req.params.id}'`;

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

// @desc      Delete galery
// @route     DELETE /api/v1/galery/:id
// @access    Private
exports.deleteGalery = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM GaleryImages WHERE galeryId='${req.params.id}'`;
  const images = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        resolve([]);
      }

      resolve(result);
    });
  });

  for (const img of images) {
    const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/galeryimages/`;
    deleteFiles([`${filePath}${img.url}` || 'photo']);
  }

  sql = `DELETE FROM GaleryImages WHERE galeryId='${req.params.id}'`;
  await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve();
    });
  });

  sql = `DELETE FROM Galery WHERE id='${req.params.id}'`;
  await new Promise((resolve, reject) => {
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
});

// @desc      Upload New Galery Image
// @route     POST /api/v1/galery/image/:id
// @access    Private
exports.uploadGaleryImage = asyncHandler(async (req, res, next) => {
  req.body.id = uuid.v1().split('-').join('');
  req.body.galeryId = req.params.id;

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/galeryimages/`,
      req.body.id,
      files
    );

    req.body = {
      ...req.body,
      url: img?.name || '',
      alt: 'image'
    };

    const sql = 'INSERT INTO GaleryImages SET ?';
    db.queryWithParams(sql, req.body, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }
      res.status(201).json({
        success: true,
        data: {
          url: `/galeryimages/${req.body.url}`,
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
  let sql = `SELECT * FROM GaleryImages WHERE id='${req.params.id}'`;
  const image = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      resolve(result[0]);
    });
  });

  const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/galeryimages/`;
  deleteFiles([`${filePath}${image.url}` || 'photo']);

  sql = `DELETE FROM GaleryImages WHERE id='${req.params.id}'`;
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
