import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());



const hrQuestions = [
  {
    question: "Tell me about yourself.",
    answer: "Give a short introduction including education, skills, projects and career goals."
  },
  {
    question: "Why should we hire you?",
    answer: "Explain your skills, problem-solving ability and how you add value to the company."
  },
  {
    question: "What are your strengths?",
    answer: "Mention technical skills, communication, teamwork and learning ability."
  },
  {
    question: "What are your weaknesses?",
    answer: "Mention a real weakness and explain how you are improving it."
  },
  {
    question: "Why do you want to work here?",
    answer: "Show knowledge about company culture, growth and learning opportunities."
  },
  {
    question: "Where do you see yourself in 5 years?",
    answer: "Talk about growth, learning and contributing to the company."
  },
  {
    question: "Describe a challenge you faced.",
    answer: "Explain situation, action taken and result achieved."
  },
  {
    question: "How do you handle pressure?",
    answer: "Explain prioritization, calm mindset and problem solving."
  },
  {
    question: "Are you a team player?",
    answer: "Give real example of teamwork or collaboration."
  },
  {
    question: "Why did you choose this career?",
    answer: "Explain passion, interest and long-term vision."
  },
  {
    question: "What motivates you?",
    answer: "Learning, solving problems, growth and achieving goals."
  },
  {
    question: "Do you have any questions for us?",
    answer: "Ask about learning opportunities, team culture or growth."
  }
];

/* ===========================
   📚 Frontend 100 Questions
=========================== */
const frontendQuestions = [
  {
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces using components and virtual DOM."
  },
  {
    question: "What is Virtual DOM?",
    answer: "Virtual DOM is a lightweight copy of the real DOM used by React to optimize updates."
  },
  {
    question: "Difference between var, let and const?",
    answer: "var is function scoped, let and const are block scoped. const cannot be reassigned."
  },
  {
    question: "What is useState?",
    answer: "useState is a React hook that allows functional components to manage state."
  }
];


/* ===========================
   🎯 Generate Question Route
=========================== */

app.post("/generate", (req, res) => {

  const { role, index } = req.body;

  if (role === "Frontend Developer") {

    if (index < frontendQuestions.length) {
      return res.json(frontendQuestions[index]);
    }
  }

  if (role === "HR Interview") {

    if (index < hrQuestions.length) {
      return res.json(hrQuestions[index]);
    }
  }

  return res.json({
    question: "Interview Completed 🎉",
    answer: ""
  });

});
/* ===========================
   🧠 Smart Feedback Route
=========================== */

app.post("/feedback", (req, res) => {
  const { answer } = req.body;

  let score = 0;
  let feedback = "";

  if (!answer || answer.length < 20) {
    score = 3;
    feedback = "Answer too short. Try to explain in more detail.";
  } else if (answer.length < 80) {
    score = 6;
    feedback = "Good attempt. Add more technical depth and examples.";
  } else {
    score = 8;
    feedback = "Strong answer! Well explained with good structure.";
  }

  res.json({
    feedback: `${feedback} \nScore: ${score}/10`
  });
});

/* ===========================
   🚀 Start Server
=========================== */

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});