const express = require('express');
const { uploadImage } = require('../controllers/imagesC');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/').post(protect, uploadImage);

module.exports = router;
