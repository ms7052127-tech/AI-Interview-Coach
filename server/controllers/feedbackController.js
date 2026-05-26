const Feedback = require('../models/Feedback');

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('questionId', 'text domain difficulty')
      .populate('answerId', 'answerText isTimedOut timeTaken');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    // Ensure user can only see their own feedback
    if (feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get all feedback for an interview
// @route   GET /api/feedback/interview/:interviewId
const getInterviewFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      interviewId: req.params.interviewId,
      userId: req.user._id
    }).populate('questionId', 'text order');

    res.json({ feedbacks });
  } catch (error) {
    console.error('Get interview feedback error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getFeedback, getInterviewFeedback };
