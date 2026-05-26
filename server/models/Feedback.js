const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  suggestions: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  strengths: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
