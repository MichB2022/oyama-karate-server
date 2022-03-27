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

const { protect } = require('../middleware/auth');

router.route('/').get(getCalendars).post(protect, createCalendar);
router
  .route('/:id')
  .get(getCalendarById)
  .post(protect, updateCalendar)
  .delete(protect, deleteCalendar);
router.route('/:id/photo').put(protect, calendarPhotoUpload);

module.exports = router;
