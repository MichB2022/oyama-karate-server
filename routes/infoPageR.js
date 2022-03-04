const express = require('express');
const {
  getInfoPagesLabels,
  getInfoPage,
  createInfoPage,
  updateInfoPage,
  deleteInfoPage
} = require('../controllers/infoPageC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getInfoPagesLabels).post(createInfoPage);
router
  .route('/:id')
  .get(getInfoPage)
  .post(updateInfoPage)
  .delete(deleteInfoPage);

module.exports = router;
