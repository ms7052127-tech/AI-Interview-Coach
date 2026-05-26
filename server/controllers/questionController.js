const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { generateQuestions } = require('../config/gemini');

// @desc    Generate AI questions and start an interview session
// @route   GET /api/questions/generate
const generate = async (req, res) => {
  try {
    const { domain, difficulty, count = 5 } = req.query;

    if (!domain || !difficulty) {
      return res.status(400).json({ error: 'Domain and difficulty are required.' });
    }

    const validDomains = ['Web Development', 'JavaScript', 'React', 'Node.js', 'HR Questions'];
    const validDifficulties = ['Easy', 'Medium', 'Hard'];

    if (!validDomains.includes(domain)) {
      return res.status(400).json({ error: 'Invalid domain selected.' });
    }
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty selected.' });
    }

    // Create interview session
    const interview = await Interview.create({
      userId: req.user._id,
      domain,
      difficulty,
      totalQuestions: Number(count),
      status: 'active'
    });

    // Generate questions using AI
    const aiQuestions = await generateQuestions(domain, difficulty, Number(count));

    // Save questions to DB
    const questionDocs = await Question.insertMany(
      aiQuestions.map((q, idx) => ({
        text: q.text,
        correctAnswer: q.answer || '',
        domain,
        difficulty,
        interviewId: interview._id,
        order: q.order || idx + 1
      }))
    );

    res.json({
      message: 'Interview session started!',
      interviewId: interview._id,
      questions: questionDocs.map(q => ({
        id: q._id,
        text: q.text,
        order: q.order
      }))
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate questions.' });
  }
};

module.exports = { generate };
