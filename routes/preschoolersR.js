const express = require('express');
const {
  getPreschooler,
  createPreschooler,
  updatePreschooler,
  deletePreschooler,
  preschoolerPhotoUpload
} = require('../controllers/preschoolersC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getPreschooler).post(createPreschooler);
router.route('/:id').post(updatePreschooler).delete(deletePreschooler);
router.route('/:id/photo').put(preschoolerPhotoUpload);

module.exports = router;
