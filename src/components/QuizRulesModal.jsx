import "./QuizRulesModal.css";

function QuizRulesModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Quiz Rules</h3>
        <ul>
          <li>✅ 1 point for each correct answer</li>
          <li>❓ 10 total questions</li>
          <li>🏆 Max score: 10 points</li>
        </ul>
        <button className="close-button" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}

export default QuizRulesModal;
