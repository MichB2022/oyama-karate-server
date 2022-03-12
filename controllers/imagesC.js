const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Upload New Image
// @route     POST /api/v1/images
// @access    Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Images SET ?';

  req.body.id = uuid.v1().split('-').join('');

  if (req.files) {
    const img = req.files.img;

    const files = [img];
    files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/images/`,
      req.body.id,
      files
    );

    req.body = {
      ...req.body,
      url: img?.name || '',
      alt: 'image'
    };

    await db.queryWithParams(sql, req.body, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }
    });

    res.status(201).json({
      success: true,
      data: {
        url: `/images/${req.body.url}`,
        alt: req.body.alt
      }
    });
  }
});
