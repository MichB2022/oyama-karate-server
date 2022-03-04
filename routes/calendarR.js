const express = require('express');
const {
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  calendarPhotoUpload
} = require('../controllers/calendarC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getCalendar).post(createCalendar);
router.route('/:id').post(updateCalendar).delete(deleteCalendar);
router.route('/:id/photo').put(calendarPhotoUpload);

module.exports = router;
