import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import "./Quiz.css";

// Helper function to shuffle the answer choices randomly
function shuffleArray(array) {
  const arr = [...array]; // Clone array to avoid mutating the original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}

function Quiz({ config, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Check if current question is the last one
  const isLastQuestion = currentIndex === questions.length - 1;

  // Fetch questions from API when component mounts
  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${config.category}&difficulty=${config.difficulty}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Format questions and shuffle answers
        const formatted = data.results.map((q) => {
          const answers = shuffleArray(
            q.type === "boolean"
              ? ["True", "False"]
              : [q.correct_answer, ...q.incorrect_answers]
          );
          return { ...q, answers };
        });

        // Initialize quiz state
        setQuestions(formatted);
        setTimer(0);
        setShowResult(false);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
      });
  }, [config]);

  // Start timer when quiz is active
  useEffect(() => {
    if (showResult) return; // Stop timer if result is shown

    const timerId = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    // Clear timer on cleanup
    return () => clearInterval(timerId);
  }, [showResult]);

  const handleAnswer = (answer) => {
    // Prevent changing the answer once selected
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    // Increase score if answer is correct
    if (answer === questions[currentIndex].correct_answer) {
      setScore((s) => s + 1);
    }
  };

  // Move to the next question
  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Show loading spinner until questions are loaded
  if (questions.length === 0) return <span className="spinner"></span>;

  // Show results when quiz ends
  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(0);
    const scoreClass = percentage >= 60 ? "score green" : "score red";

    return (
      <div className="result-container">
        <h2>Quiz Completed</h2>
        <p className={scoreClass}>{percentage}%</p>
        <p>Your Time: {formatTime(timer)}</p>
        <p>
          {score >= 6
            ? "✅ Great job! You did really well!"
            : "💡 Keep practicing! You’ll improve with time!"}
        </p>
        <button onClick={onBack}>Back to Start</button>
      </div>
    );
  }

  const q = questions[currentIndex];

  // Format time in MM:SS format
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="quiz-container">
      <ProgressBar current={currentIndex} total={questions.length} />
      <h2 className="question-count">Question {currentIndex + 1}</h2>

      {/* Render question with potential HTML formatting */}
      <h2 dangerouslySetInnerHTML={{ __html: q.question }} />
      <div className="quiz-info">
        <p>
          Score: {score}/ {questions.length}
        </p>
        <p>Time: {formatTime(timer)}</p>
      </div>
      <div className="answers">
        {q.answers.map((ans, idx) => {
          const isCorrect = ans === q.correct_answer;
          const isSelected = selectedAnswer === ans;

          // Determine button styling based on selected/correct status
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(ans)}
              className={
                selectedAnswer
                  ? isCorrect
                    ? "correct"
                    : isSelected
                    ? "wrong"
                    : ""
                  : ""
              }
              dangerouslySetInnerHTML={{ __html: ans }}
              disabled={selectedAnswer !== null} // Disable buttons after selection
            />
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="buttons-container">
        <button className="back-button" onClick={onBack}>
          Back
        </button>

        {isLastQuestion ? (
          // Show submit on final question
          <button
            className="next-button"
            onClick={() => setShowResult(true)}
            disabled={selectedAnswer === null}
          >
            Submit
          </button>
        ) : (
          // Otherwise show next
          <button
            className="next-button"
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
