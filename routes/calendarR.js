const express = require('express');
const {
  getCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  calendarPhotoUpload
} = require('../controllers/calendarC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getCalendars).post(createCalendar);
router
  .route('/:id')
  .get(getCalendarById)
  .post(updateCalendar)
  .delete(deleteCalendar);
router.route('/:id/photo').put(calendarPhotoUpload);

module.exports = router;
