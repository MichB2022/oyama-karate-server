const express = require('express');
const {
  getHomepage,
  createHomepage,
  updateHomepage,
  deleteHomepage
} = require('../controllers/homepageC');

const router = express.Router();

router.route('/').get(getHomepage).post(createHomepage);
router.route('/:id').post(updateHomepage).delete(deleteHomepage);

module.exports = router;
