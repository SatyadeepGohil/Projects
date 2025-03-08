import React, { useState, useMemo } from "react";
import SidebarNav from "./SidebarNav";
import '../src/App.css';
/* import TaskList from "./TaskList"; */ // Component that renders tasks
/* import tasksData from "./data/tasks"; */ // Assume this is your tasks array

function App() {
  const [selectedFilter, setSelectedFilter] = useState("all"); // default filter

  // Memoize the filtered tasks to avoid unnecessary calculations
  /* const filteredTasks = useMemo(() => {
    if (selectedFilter === "all") {
      return tasksData;
    } else if (selectedFilter === "today") {
      const today = new Date().toDateString();
      return tasksData.filter(
        (task) => new Date(task.dueDate).toDateString() === today
      );
    } else if (selectedFilter === "planned") {
      return tasksData.filter((task) => task.isPlanned);
    }
    return tasksData;
  }, [selectedFilter]); */

  return (
    <div className="App">
      <SidebarNav setSelectedFilter={setSelectedFilter} />
    </div>
  );
}

export default App;