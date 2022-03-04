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

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/:id/photo').put(sectionPhotoUpload);

router.route('/').get(getSections).post(createSection);

router.route('/labels').get(getSectionsLabelsAndNames);

router.route('/:id').get(getSection).put(updateSection).delete(deleteSection);

module.exports = router;
