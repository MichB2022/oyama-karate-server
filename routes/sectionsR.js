const express = require('express');
const {
  getSections,
  getSectionsLabelsAndNames,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  sectionPhotoUpload
} = require('../controllers/sectionsC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/:id/photo').put(protect, sectionPhotoUpload);

router.route('/').get(getSections).post(protect, createSection);

router.route('/labels').get(getSectionsLabelsAndNames);

router
  .route('/:id')
  .get(getSection)
  .put(protect, updateSection)
  .delete(protect, deleteSection);

module.exports = router;
