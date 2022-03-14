const express = require('express');
const {
  getMotivation,
  uploadMotivationImage,
  deleteGaleryImage
} = require('../controllers/motivationC');

const router = express.Router();

router.route('/').get(getMotivation);
router.route('/image').post(uploadMotivationImage);
router.route('/image/:id').delete(deleteGaleryImage);

module.exports = router;
