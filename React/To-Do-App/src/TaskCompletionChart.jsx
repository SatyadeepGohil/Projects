// TaskCompletionChart.jsx
import React from "react";

const TaskCompletionChart = ({ completedTasksCount, totalTasksCount }) => {
  // Calculate completed percentage
  const percentage = totalTasksCount > 0 
    ? (completedTasksCount / totalTasksCount) * 100 
    : 0;
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Calculate stroke offset based on percentage
  const offset = circumference - (percentage / 100 * circumference);

  return (
    <div className="donut-chart">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background circle (gray) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#ccc"
          strokeWidth="8"
        />
        {/* Completed tasks circle (green) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#4caf50"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        {/* Center circle to create donut effect */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
    </div>
  );
};

export default TaskCompletionChart;
