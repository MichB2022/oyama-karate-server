const express = require('express');
const {
  getSectionsGroup,
  createSectionsGroup,
  updateSectionsGroup,
  deleteSectionsGroup,
  getSectionsGroupSchedule,
  createSectionsGroupSchedule,
  updateSectionsGroupSchedule,
  deleteSectionsGroupSchedule
} = require('../controllers/sectionsGroupC');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getSectionsGroup);
router.route('/add').post(protect, createSectionsGroup);
router
  .route('/:id')
  .post(protect, updateSectionsGroup)
  .delete(protect, deleteSectionsGroup);
router.route('/schedule').get(getSectionsGroupSchedule);
router.route('/schedule/add').post(protect, createSectionsGroupSchedule);
router
  .route('/schedule/:id')
  .post(protect, updateSectionsGroupSchedule)
  .delete(protect, deleteSectionsGroupSchedule);

module.exports = router;
