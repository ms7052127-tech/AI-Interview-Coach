const express = require('express');
const router = express.Router();
const { submit } = require('../controllers/answerController');
const { protect } = require('../middleware/auth');

router.post('/submit', protect, submit);

module.exports = router;
