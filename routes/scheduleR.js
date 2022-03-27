const express = require('express');
const {
  getAllSchedules,
  getAllSchedulesNames,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllScheduleRows,
  getAllScheduleRowsForSection,
  getScheduleRowById,
  createScheduleRow,
  updateScheduleRow,
  deleteScheduleRow
} = require('../controllers/scheduleC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getAllSchedules).post(protect, createSchedule);
router.route('/names').get(getAllSchedulesNames);
router.route('/add').post(protect, createSchedule);
router
  .route('/:id')
  .get(getScheduleById)
  .post(protect, updateSchedule)
  .delete(protect, deleteSchedule);

router.route('/row/all').get(getAllScheduleRows);
router.route('/row/add').post(protect, createScheduleRow);
router
  .route('/row/:id')
  .get(getAllScheduleRowsForSection)
  .post(protect, updateScheduleRow)
  .delete(protect, deleteScheduleRow);
router.route('/row/single/:id').get(getScheduleRowById);

module.exports = router;
