const express = require('express');
const {
  getCalendarPage,
  createCalendarPage,
  updateCalendarPage
} = require('../controllers/calendarPageC');

const router = express.Router();

router.route('/').get(getCalendarPage).post(createCalendarPage);
router.route('/:id').post(updateCalendarPage);

module.exports = router;
