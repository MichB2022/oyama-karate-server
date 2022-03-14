const express = require('express');
const {
  getGaleries,
  getGalery,
  createGalery,
  updateGalery,
  deleteGalery,
  uploadGaleryImage,
  deleteGaleryImage
} = require('../controllers/galeriesC');

const router = express.Router();

router.route('/').get(getGaleries).post(createGalery);
router.route('/:id').get(getGalery).post(updateGalery).delete(deleteGalery);
router.route('/image/:id').post(uploadGaleryImage).delete(deleteGaleryImage);

module.exports = router;
