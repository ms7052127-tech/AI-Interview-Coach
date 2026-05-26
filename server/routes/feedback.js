const express = require('express');
const router = express.Router();
const { getFeedback, getInterviewFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, getFeedback);
router.get('/interview/:interviewId', protect, getInterviewFeedback);

module.exports = router;
