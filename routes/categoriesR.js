const express = require('express');
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoriesC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getCategories).post(protect, createCategory);

router.route('/:id').delete(protect, deleteCategory);

module.exports = router;
