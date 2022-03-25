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

router.route('/').get(getHomepage).post(createHomepage);
router.route('/contact').get(getContact);
router.route('/updateorder').post(updateOrder);
router.route('/description').get(getDescription);
router.route('/:id').post(updateHomepage).delete(deleteHomepage);

module.exports = router;
