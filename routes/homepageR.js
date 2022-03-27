const express = require('express');
const {
  getHomepage,
  getContact,
  getDescription,
  createHomepage,
  updateHomepage,
  updateOrder,
  deleteHomepage
} = require('../controllers/homepageC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getHomepage).post(protect, createHomepage);
router.route('/contact').get(getContact);
router.route('/updateorder').post(protect, updateOrder);
router.route('/description').get(getDescription);
router
  .route('/:id')
  .post(protect, updateHomepage)
  .delete(protect, deleteHomepage);

module.exports = router;
