import React from "react";
import "./ProgressBar.css";

function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <span className="progress-label">
        Question {current + 1} of {total}
      </span>
    </div>
  );
}

export default ProgressBar;
