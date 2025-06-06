import React, { useState } from "react";
import QuizSelector from "./components/QuizSelector";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const [quizConfig, setQuizConfig] = useState(null);

  return (
    <div className="app-container">
      {!quizConfig ? (
        <QuizSelector onStartQuiz={setQuizConfig} />
      ) : (
        <Quiz config={quizConfig} onBack={() => setQuizConfig(null)} />
      )}
    </div>
  );
}

export default App;
