const express = require('express');
const {
  getPreschooler,
  createPreschooler,
  updatePreschooler,
  deletePreschooler,
  preschoolerPhotoUpload
} = require('../controllers/preschoolersC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getPreschooler).post(protect, createPreschooler);
router
  .route('/:id')
  .post(protect, updatePreschooler)
  .delete(protect, deletePreschooler);
router.route('/:id/photo').put(protect, preschoolerPhotoUpload);

module.exports = router;
