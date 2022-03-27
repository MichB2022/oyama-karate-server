const express = require('express');
const {
  getInstructors,
  getInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  instructorPhotoUpload
} = require('../controllers/instructorC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getInstructors).post(protect, createInstructor);
router
  .route('/:id')
  .get(getInstructor)
  .post(protect, updateInstructor)
  .delete(protect, deleteInstructor);
router.route('/:id/photo').put(protect, instructorPhotoUpload);

module.exports = router;
