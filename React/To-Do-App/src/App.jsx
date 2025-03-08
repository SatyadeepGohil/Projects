import React, { useState, useEffect } from "react";
import SidebarNav from "./SidebarNav";
import TaskContainer from "./TasksContainer";
import TaskUtils from "./TaskUtils"; // Import the task utilities
import '../src/App.css';

function App() {
  const [todayTasksCount, setTodayTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Update today's task count for the sidebar indicator
  useEffect(() => {
    const allTasks = TaskUtils.getAllTasks();
    setTotalTasksCount(allTasks.length);
    setCompletedTasksCount(TaskUtils.getCompletedTasks().length);
    setTodayTasksCount(TaskUtils.getTodayTasks().length);
  }, []);

  return (
    <div className="app-container">
      <SidebarNav 
        setSelectedFilter={setSelectedFilter} 
        todayTasksCount={todayTasksCount}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />
      <TaskContainer selectedFilter={selectedFilter} />
    </div>
  );
}

export default App;
