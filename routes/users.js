const express = require('express');
const { getUser, createUser, updateUser } = require('../controllers/users');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(createUser);

router.route('/:id').get(getUser).post(updateUser);

module.exports = router;
