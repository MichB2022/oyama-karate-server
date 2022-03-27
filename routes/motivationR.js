const express = require('express');
const {
  getMotivation,
  uploadMotivationImage,
  deleteGaleryImage
} = require('../controllers/motivationC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getMotivation);
router.route('/image').post(protect, uploadMotivationImage);
router.route('/image/:id').delete(protect, deleteGaleryImage);

module.exports = router;
