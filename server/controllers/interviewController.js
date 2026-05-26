const Interview = require('../models/Interview');
const User = require('../models/User');

// @desc    Complete an interview session and compute final score
// @route   POST /api/interviews/:id/complete
const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    if (interview.status === 'completed') {
      return res.json({ message: 'Interview already completed.', interview });
    }

    // Calculate final score
    const totalScore = interview.feedbackSummary.reduce((sum, f) => sum + f.score, 0);
    const avgScore = interview.feedbackSummary.length > 0
      ? Math.round((totalScore / interview.feedbackSummary.length) * 10) / 10
      : 0;

    // Update interview
    interview.status = 'completed';
    interview.score = avgScore;
    await interview.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    const newTotal = user.totalInterviews + 1;
    const newAvgScore = Math.round(
      ((user.averageScore * user.totalInterviews + avgScore) / newTotal) * 10
    ) / 10;

    await User.findByIdAndUpdate(req.user._id, {
      totalInterviews: newTotal,
      averageScore: newAvgScore
    });

    res.json({
      message: 'Interview completed!',
      results: {
        interviewId: interview._id,
        domain: interview.domain,
        difficulty: interview.difficulty,
        totalQuestions: interview.questionsAttempted,
        averageScore: avgScore,
        feedbackSummary: interview.feedbackSummary,
        date: interview.date
      }
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get all interviews for a user
// @route   GET /api/interviews/history
const getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id,
      status: 'completed'
    })
      .sort({ date: -1 })
      .limit(20);

    res.json({ interviews });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get single interview result
// @route   GET /api/interviews/:id
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }

    res.json({ interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { completeInterview, getHistory, getInterview };
