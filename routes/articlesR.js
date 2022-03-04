const express = require('express');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  articlePhotoUpload
} = require('../controllers/articlesC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/:id/photo').put(articlePhotoUpload);

router.route('/').get(getArticles).post(createArticle);

router.route('/:id').get(getArticle).put(updateArticle).delete(deleteArticle);

module.exports = router;
