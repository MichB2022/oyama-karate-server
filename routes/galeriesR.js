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

const { protect } = require('../middleware/auth');

router.route('/').get(getGaleries).post(protect, createGalery);
router
  .route('/:id')
  .get(getGalery)
  .post(protect, updateGalery)
  .delete(protect, deleteGalery);
router
  .route('/image/:id')
  .post(protect, uploadGaleryImage)
  .delete(protect, deleteGaleryImage);

module.exports = router;
