const express = require('express');
const { uploadImage } = require('../controllers/imagesC');

const router = express.Router();

router.route('/').post(uploadImage);

module.exports = router;
