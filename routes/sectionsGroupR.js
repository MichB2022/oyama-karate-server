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

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getSectionsGroup);
router.route('/add').post(createSectionsGroup);
router.route('/:id').post(updateSectionsGroup).delete(deleteSectionsGroup);
router.route('/schedule').get(getSectionsGroupSchedule);
router.route('/schedule/add').post(createSectionsGroupSchedule);
router
  .route('/schedule/:id')
  .post(updateSectionsGroupSchedule)
  .delete(deleteSectionsGroupSchedule);

module.exports = router;
