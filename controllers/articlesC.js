const path = require('path');
const slugify = require('slugify');
const fs = require('fs');
const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const checkIfFileIsImage = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all articles
// @route     GET /api/v1/articles
// @access    Public
exports.getArticles = asyncHandler(async (req, res, next) => {
  let sql = 'SELECT * FROM Article';

  const articles = await new Promise((resolve, reject) => {
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

    sql = `SELECT * FROM Article LIMIT ${limit} OFFSET ${startIndex}`;
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      res.status(201).json({
        success: true,
        count: articles.length,
        pagination: {
          currentPage: page,
          perPage: limit,
          pagesCount: Math.ceil(articles.length / limit)
        },
        data: result
      });
    });
  } else {
    res.status(201).json({
      success: true,
      count: articles.length,
      data: articles
    });
  }
});

// @desc      Get single article
// @route     GET /api/v1/articles/:id
// @access    Public
exports.getArticle = asyncHandler(async (req, res, next) => {
  const sql = `SELECT * FROM Article WHERE id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    } else if (!result.length) {
      return next(new ErrorResponse('Article not found', 404));
    }

    res.status(201).json({
      success: true,
      data: result
    });
  });
});

// @desc      Create new article
// @route     POST /api/v1/articles
// @access    Private
exports.createArticle = asyncHandler(async (req, res, next) => {
  const sql = 'INSERT INTO Article SET ?';

  req.body.id = uuid.v1().split('-').join('');
  req.body.slug = slugify(req.body.title, { lower: true });
  req.body.createdAt = new Date();

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

// @desc      Update article
// @route     PUT /api/v1/articles/:id
// @access    Private
exports.updateArticle = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Article WHERE id='${req.params.id}'`;
  const article = await new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      } else if (!result.length) {
        return next(new ErrorResponse('Article not found', 404));
      }

      resolve(result);
    });
  });

  sql = `UPDATE Article SET ? WHERE id='${req.params.id}'`;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true });
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

// @desc      Delete article
// @route     DELETE /api/v1/articles/:id
// @access    Private
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  let sql = `SELECT * FROM Article WHERE id='${req.params.id}'`;

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    } else if (!result.length) {
      return next(new ErrorResponse('Article not found', 404));
    }

    sql = `DELETE FROM Article WHERE id='${req.params.id}'`;

    if (
      fs.existsSync(
        `${process.env.FILE_UPLOAD_PATH}/photos/sections/${result[0].bigImgUrl}`
      )
    ) {
      fs.unlinkSync(
        `${process.env.FILE_UPLOAD_PATH}/photos/sections/${result[0].bigImgUrl}`
      );
    }
    if (
      fs.existsSync(
        `${process.env.FILE_UPLOAD_PATH}/photos/sections/${result[0].smallImgUrl}`
      )
    ) {
      fs.unlinkSync(
        `${process.env.FILE_UPLOAD_PATH}/photos/sections/${result[0].smallImgUrl}`
      );
    }

    const resolveDelete = (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      res.status(201).json({
        success: true,
        data: {}
      });
    };

    db.query(sql, resolveDelete);
  };

  db.query(sql, resolve);
});

// @desc      Upload photos for articles
// @route     PUT /api/v1/articles/:id/photo
// @access    Private
exports.articlePhotoUpload = asyncHandler(async (req, res, next) => {
  const upload = () => {
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const bigImage = req.files.bigImg;
    const smallImage = req.files.smallImg;

    checkIfFileIsImage([bigImage, smallImage]);

    // Create custom filename
    bigImage.name = `photo_${req.params.id}_big${
      path.parse(bigImage.name).ext
    }`;
    smallImage.name = `photo_${req.params.id}_small${
      path.parse(smallImage.name).ext
    }`;

    // Move files to their folder
    bigImage.mv(
      `${process.env.FILE_UPLOAD_PATH}/photos/articles/${bigImage.name}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(
            new ErrorResponse(`Problem with file upload: ${err}`, 500)
          );
        }
      }
    );

    smallImage.mv(
      `${process.env.FILE_UPLOAD_PATH}/photos/articles/${smallImage.name}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
      }
    );

    const queryParams = {
      bigImgUrl: bigImage.name,
      smallImgUrl: smallImage.name,
      bigImgAlt: req.body.bigImgAlt,
      smallImgAlt: req.body.smallImgAlt
    };

    sql = `UPDATE Article SET ? WHERE id='${req.params.id}'`;

    const resolveUpdate = (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      res.status(201).json({
        success: true,
        data: result
      });
    };

    db.queryWithParams(sql, queryParams, resolveUpdate);
  };

  doArticleExistProtectedAction(next, req.params.id, upload);
});

const doArticleExistProtectedAction = async (next, id, action) => {
  const sql = `SELECT * FROM Article WHERE id='${id}'`;

  const resolve = (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    } else if (!result.length) {
      return next(new ErrorResponse('Article not found', 404));
    }

    action();
  };

  db.query(sql, resolve);
};
