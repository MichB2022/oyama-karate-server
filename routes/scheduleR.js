const express = require('express');
const {
  getAllSchedules,
  getAllSchedulesNames,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllScheduleRows,
  getAllScheduleRowsForSection,
  createScheduleRow,
  updateScheduleRow,
  deleteScheduleRow
} = require('../controllers/scheduleC');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getAllSchedules).post(createSchedule);
router.route('/names').get(getAllSchedulesNames);
router.route('/add').post(createSchedule);
router.route('/:id').post(updateSchedule).delete(deleteSchedule);

router.route('/row').get(getAllScheduleRows);
router.route('/row/add').post(createScheduleRow);
router
  .route('/row/:id')
  .get(getAllScheduleRowsForSection)
  .post(updateScheduleRow)
  .delete(deleteScheduleRow);

module.exports = router;
