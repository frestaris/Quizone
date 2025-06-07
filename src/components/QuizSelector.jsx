import { useEffect, useState } from "react";
import "./QuizSelector.css";
import QuizRulesModal from "./QuizRulesModal";

function QuizSelector({ onStartQuiz }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  const startQuiz = () => {
    onStartQuiz({ category, difficulty });
  };

  return (
    <div className="selector-container">
      <h2>
        Quiz-One
        <span
          className="rules-icon"
          title="View Quiz Rules"
          onClick={() => setShowRules(true)}
        >
          ❓
        </span>
      </h2>

      <label className="selector-label">
        Category:
        <select
          className="selector-select"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.replace(/^(Entertainment|Science):\s*/, "")}
            </option>
          ))}
        </select>
      </label>

      <label className="selector-label">
        Difficulty:
        <select
          className="selector-select"
          onChange={(e) => setDifficulty(e.target.value)}
          value={difficulty}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <button className="start-button" onClick={startQuiz}>
        Start Quiz
      </button>

      {showRules && <QuizRulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}

export default QuizSelector;
