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

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getInstructors).post(createInstructor);
router
  .route('/:id')
  .get(getInstructor)
  .post(updateInstructor)
  .delete(deleteInstructor);
router.route('/:id/photo').put(instructorPhotoUpload);

module.exports = router;
