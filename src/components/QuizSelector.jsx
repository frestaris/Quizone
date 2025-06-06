import React, { useEffect, useState } from "react";

function QuizSelector({ onStartQuiz }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");

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
      <h2>Select Quiz</h2>
      <label>
        Category:
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.replace(/^(Entertainment|Science):\s*/, "")}{" "}
            </option>
          ))}
        </select>
      </label>
      <label>
        Difficulty:
        <select
          onChange={(e) => setDifficulty(e.target.value)}
          value={difficulty}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
}

export default QuizSelector;
