import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function shuffleArray(array) {
  const arr = [...array]; // create a copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
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

  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${config.category}&difficulty=${config.difficulty}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const answers = shuffleArray(
            q.type === "boolean"
              ? ["True", "False"]
              : [q.correct_answer, ...q.incorrect_answers]
          );
          return { ...q, answers };
        });
        setQuestions(formatted);
        setTimer(0);
        setShowResult(false);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
      });
  }, [config]);

  useEffect(() => {
    if (showResult) return; // stop timer when quiz ended

    const timerId = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [showResult]);

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === questions[currentIndex].correct_answer) {
      setScore((s) => s + 1);
    }
    setTimeout(() => handleNext(), 1500);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (showResult)
    return (
      <div className="result-container">
        <h2>Quiz Completed</h2>
        <p>
          Your Score: {score} / {questions.length}
        </p>
        <button onClick={onBack}>Back to Start</button>
      </div>
    );

  const q = questions[currentIndex];

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="quiz-container">
      <ProgressBar current={currentIndex} total={questions.length} />
      <h2 dangerouslySetInnerHTML={{ __html: q.question }} />
      <p>Time: {formatTime(timer)}</p>
      <div className="answers">
        {q.answers.map((ans, idx) => {
          const isCorrect = ans === q.correct_answer;
          const isSelected = selectedAnswer === ans;
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
            />
          );
        })}
      </div>
      <button onClick={onBack}>Back to Start</button>
      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
