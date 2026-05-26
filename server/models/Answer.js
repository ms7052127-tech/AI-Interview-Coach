const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  answerText: {
    type: String,
    default: ''
  },
  isTimedOut: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number, // seconds
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
