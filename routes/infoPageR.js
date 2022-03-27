const express = require('express');
const {
  getInfoPagesLabels,
  getInfoPage,
  createInfoPage,
  updateInfoPage,
  deleteInfoPage
} = require('../controllers/infoPageC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getInfoPagesLabels).post(protect, createInfoPage);
router
  .route('/:id')
  .get(getInfoPage)
  .post(protect, updateInfoPage)
  .delete(protect, deleteInfoPage);

module.exports = router;
