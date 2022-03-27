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

const { protect } = require('../middleware/auth');

router.route('/:id/photo').put(protect, articlePhotoUpload);

router.route('/').get(getArticles).post(protect, createArticle);

router
  .route('/:id')
  .get(getArticle)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;
