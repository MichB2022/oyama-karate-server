const express = require('express');
const {
  login,
  logout,
  updatePassword,
  authorize
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/logout', logout);
router.get('/authorize', protect, authorize);
router.post('/updatepassword', protect, updatePassword);

module.exports = router;
