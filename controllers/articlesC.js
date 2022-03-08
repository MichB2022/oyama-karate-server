const path = require('path');
const slugify = require('slugify');
const fs = require('fs');
const { ErrorResponse, returnErr } = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {
  checkIfFileIsImage,
  deleteFiles,
  uploadFiles
} = require('../utils/imageFiles');
const uuid = require('uuid');
const db = require('../utils/db');

// @desc      Get all articles
// @route     GET /api/v1/articles
// @access    Public
exports.getArticles = asyncHandler(async (req, res, next) => {
  let where = '';
  if (req.query.title && req.query.filterByCategory) {
    where = `WHERE title LIKE '%${req.query.title}%' AND category_id='${req.query.filterByCategory}'`;
  } else if (req.query.title) {
    where = `WHERE title LIKE '%${req.query.title}%'`;
  } else if (req.query.filterByCategory) {
    where = `WHERE category_id='${req.query.filterByCategory}'`;
    console.log(where);
  }

  let sql = `SELECT * FROM Article ${where}`;
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

    sql = `SELECT a.*, c.name as categoryName FROM Article a INNER JOIN Category c ON a.category_id=c.id ${where} ORDER BY a.createdAt DESC LIMIT ${limit} OFFSET ${startIndex}`;
    db.query(sql, (err, result) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }

      result.map((el) => (el.tags = el.tags.split(',')));

      res.status(201).json({
        success: true,
        count: articles.length,
        pagination: {
          currentPage: page,
          perPage: limit,
          pagesCount: Math.ceil(articles.length / limit)
        },
        data: result || []
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
  const sql = `SELECT a.*, c.name as categoryName FROM Article a INNER JOIN Category c ON a.category_id=c.id WHERE a.id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) {
      return next(new ErrorResponse(err, 500));
    } else if (!result.length) {
      return next(new ErrorResponse('Article not found', 404));
    }

    result[0].tags = result[0].tags.split(',');

    res.status(201).json({
      success: true,
      data: result[0] || {}
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
  req.body.createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // req.body.tags = req.body?.tags.map((tag) => tag.name).join(',');

  if (req.files) {
    const bigImg = req.files.bigImg;
    const smallImg = req.files.smallImg;

    let files = [bigImg, smallImg];
    files = files.filter((file) => file !== undefined);

    checkIfFileIsImage(files);
    uploadFiles(
      `${process.env.FILE_UPLOAD_PATH}/photos/articles/`,
      req.params.id,
      files
    );

    if (smallImg && bigImg) {
      req.body = {
        ...req.body,
        bigImgUrl: bigImg.name,
        smallImgUrl: smallImg.name
      };
    } else if (smallImg) {
      req.body = {
        ...req.body,
        smallImgUrl: smallImg.name
      };
    } else if (bigImg) {
      req.body = {
        ...req.body,
        bigImgUrl: bigImg.name
      };
    }
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
  // req.body.tags = req.body?.tags.map((tag) => tag.name).join(',');

  if (req.files) {
    const bigImg = req.files.bigImg;
    const smallImg = req.files.smallImg;

    let files = [bigImg, smallImg];
    files = files.filter((file) => file !== undefined);

    const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/articles/`;
    deleteFiles([
      bigImg ? `${filePath}${article[0].bigImgUrl || 'photo'}` : 'photo',
      smallImg ? `${filePath}${article[0].smallImgUrl || 'photo'}` : 'photo'
    ]);
    checkIfFileIsImage(files);
    uploadFiles(filePath, req.params.id, files);

    if (smallImg && bigImg) {
      req.body = {
        ...req.body,
        bigImgUrl: bigImg.name,
        smallImgUrl: smallImg.name
      };
    } else if (smallImg) {
      req.body = {
        ...req.body,
        smallImgUrl: smallImg.name
      };
    } else if (bigImg) {
      req.body = {
        ...req.body,
        bigImgUrl: bigImg.name
      };
    }
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

    const filePath = `${process.env.FILE_UPLOAD_PATH}/photos/articles/`;
    deleteFiles([
      `${filePath}${result[0].bigImgUrl || 'photo'}`,
      `${filePath}${result[0].smallImgUrl || 'photo'}`
    ]);

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
