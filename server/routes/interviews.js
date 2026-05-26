const express = require('express');
const router = express.Router();
const { completeInterview, getHistory, getInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.get('/history', protect, getHistory);
router.get('/:id', protect, getInterview);
router.post('/:id/complete', protect, completeInterview);

module.exports = router;
