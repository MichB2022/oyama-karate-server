const express = require('express');
const {
  getCalendarPage,
  createCalendarPage,
  updateCalendarPage
} = require('../controllers/calendarPageC');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/').get(getCalendarPage).post(protect, createCalendarPage);
router.route('/:id').post(protect, updateCalendarPage);

module.exports = router;
