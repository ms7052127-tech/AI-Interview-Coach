const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const Feedback = require('../models/Feedback');
const { evaluateAnswer } = require('../config/gemini');

// @desc    Submit answer and get AI feedback
// @route   POST /api/answers/submit
const submit = async (req, res) => {
  try {
    const { questionId, interviewId, answerText, isTimedOut, timeTaken } = req.body;

    if (!questionId || !interviewId) {
      return res.status(400).json({ error: 'Question ID and Interview ID are required.' });
    }

    // Validate question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Validate interview belongs to user
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    // Save answer
    const answer = await Answer.create({
      userId: req.user._id,
      questionId,
      interviewId,
      answerText: answerText || '',
      isTimedOut: isTimedOut || false,
      timeTaken: timeTaken || 0
    });

    // Evaluate with AI — pass stored correct answer from question bank
    const evaluation = await evaluateAnswer(
      question.text,
      isTimedOut ? '[Time expired - no answer submitted]' : answerText,
      interview.domain,
      interview.difficulty,
      question.correctAnswer || null
    );

    // Save feedback
    const feedback = await Feedback.create({
      answerId: answer._id,
      questionId,
      userId: req.user._id,
      interviewId,
      feedback: evaluation.feedback,
      score: evaluation.score,
      suggestions: evaluation.suggestions || [],
      correctAnswer: evaluation.correctAnswer,
      strengths: evaluation.strengths || []
    });

    // Update interview
    await Interview.findByIdAndUpdate(interviewId, {
      $inc: { questionsAttempted: 1 },
      $push: {
        feedbackSummary: {
          questionText: question.text,
          score: evaluation.score,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions || [],
          correctAnswer: evaluation.correctAnswer
        }
      }
    });

    res.json({
      message: 'Answer submitted successfully!',
      answerId: answer._id,
      feedbackId: feedback._id,
      feedback: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths || [],
        suggestions: evaluation.suggestions || [],
        correctAnswer: evaluation.correctAnswer
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit answer.' });
  }
};

module.exports = { submit };
