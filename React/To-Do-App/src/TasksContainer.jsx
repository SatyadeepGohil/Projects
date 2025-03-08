import React, { useState, useEffect } from "react";
import NotificationIcon from "../src/assets/Icon/NotificationIcon";
import RepeatIcon from "../src/assets/Icon/ReapeatIcon";
import TodayIcon from "../src/assets/Icon/TodayIcon";
import StarIcon from "../src/assets/Icon/StarIcon";
import TaskUtils from "../src/TaskUtils";
import TaskDetailSidebar from "./TaskDetailSidebar";
import '../src/Task.css';

const TaskContainer = ({ selectedFilter = "all" }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [showNotificationPicker, setShowNotificationPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showRepeatPicker, setShowRepeatPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedNotificationTime, setSelectedNotificationTime] = useState("");
    const [selectedRepeatPattern, setSelectedRepeatPattern] = useState("none");

    // Loads tasks based on selected filter
    useEffect(() => {
        let filteredTasks;
        
        switch(selectedFilter) {
            case "today":
                filteredTasks = TaskUtils.getTodayTasks();
                break;
            case "important":
                filteredTasks = TaskUtils.getImportantTasks();
                break;
            case "planned":
                filteredTasks = TaskUtils.getPlannedTasks();
                break;
            case "assigned":
                filteredTasks = TaskUtils.getAssignedToMeTasks();
                break;
            default:
                filteredTasks = TaskUtils.getAllTasks();
        }
        
        setTasks(filteredTasks);
        setCompletedTasks(filteredTasks.filter(task => task.isCompleted));
        setIncompleteTasks(filteredTasks.filter(task => !task.isCompleted));
    }, [selectedFilter]);

    // Function to request notification permission
    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
            return false;
        }
        
        if (Notification.permission === "granted") {
            return true;
        }
        
        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }
        
        return false;
    };

    // Function to schedule notification
    const scheduleNotification = (task, notificationTime) => {
        const now = new Date();
        const notificationDate = new Date(notificationTime);
        
        // Calculate milliseconds until notification
        const timeUntilNotification = notificationDate.getTime() - now.getTime();
        
        if (timeUntilNotification > 0) {
            // Schedule notification
            setTimeout(async () => {
                const hasPermission = await requestNotificationPermission();
                
                if (hasPermission) {
                    new Notification(`Task Reminder: ${task.title}`, {
                        body: task.description || "Your task is due soon!",
                        icon: "/favicon.ico"
                    });
                }
            }, timeUntilNotification);
            
            // Add notification to task
            return TaskUtils.addNotification(task.id, {
                time: notificationTime,
                message: `Reminder: ${task.title}`
            });
        }
        
        return null;
    };

    // Handle notification icon click
    const handleNotificationClick = () => {
        setShowNotificationPicker(!showNotificationPicker);
        setShowDatePicker(false);
        setShowRepeatPicker(false);
    };

    // Handle today (due date) icon click
    const handleTodayClick = () => {
        setShowDatePicker(!showDatePicker);
        setShowNotificationPicker(false);
        setShowRepeatPicker(false);
    };

    // Handle repeat icon click
    const handleRepeatClick = () => {
        setShowRepeatPicker(!showRepeatPicker);
        setShowNotificationPicker(false);
        setShowDatePicker(false);
    };

    // Add a new task with selected options
    const handleAddTask = () => {
        if (newTaskTitle.trim() === "") return;
        
        // Prepare notification time if selected
        let notificationDateTime = null;
        if (selectedNotificationTime) {
            const [hours, minutes] = selectedNotificationTime.split(':');
            const notificationDate = new Date(selectedDate);
            notificationDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
            notificationDateTime = notificationDate.toISOString();
        }
        
        // Create new task
        const newTask = TaskUtils.addTask({
            title: newTaskTitle,
            description: "",
            dueDate: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString(),
            isImportant: false,
            isPlanned: true,
            assignedTo: "me",
            notifications: [],
            repeatPattern: selectedRepeatPattern === "none" ? null : selectedRepeatPattern,
            steps: []
        });
        
        // Schedule notification if selected
        if (notificationDateTime) {
            scheduleNotification(newTask, notificationDateTime);
        }
        
        // Reset form
        setNewTaskTitle("");
        setSelectedNotificationTime("");
        setSelectedRepeatPattern("none");
        setShowNotificationPicker(false);
        setShowDatePicker(false);
        setShowRepeatPicker(false);
        
        // Update task lists
        setIncompleteTasks([...incompleteTasks, newTask]);
    };

    // Toggle task completion status
    const handleToggleCompletion = (taskId, event) => {
        // Prevent task selection when clicking checkbox
        if (event) {
            event.stopPropagation();
        }
        
        const updatedTask = TaskUtils.toggleTaskCompletion(taskId);
        
        if (updatedTask) {
            // Update both complete and incomplete task lists
            if (updatedTask.isCompleted) {
                setIncompleteTasks(incompleteTasks.filter(task => task.id !== taskId));
                setCompletedTasks([...completedTasks, updatedTask]);
            } else {
                setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
                setIncompleteTasks([...incompleteTasks, updatedTask]);
            }
            
            // Update selected task if it's the one being toggled
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask(updatedTask);
            }
        }
    };

    // Toggle task importance
    const handleToggleImportance = (taskId, event) => {
        // Prevent task selection when clicking star
        if (event) {
            event.stopPropagation();
        }
        
        const updatedTask = TaskUtils.toggleTaskImportance(taskId);
        
        if (updatedTask) {
            // Update the appropriate task list
            if (updatedTask.isCompleted) {
                setCompletedTasks(completedTasks.map(task => 
                    task.id === taskId ? updatedTask : task
                ));
            } else {
                setIncompleteTasks(incompleteTasks.map(task => 
                    task.id === taskId ? updatedTask : task
                ));
            }
            
            // Update selected task if it's the one being modified
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask(updatedTask);
            }
        }
    };

    // Select a task and open detail sidebar
    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        setSidebarOpen(true);
    };

    // Close the detail sidebar
    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    // Update task
    const handleTaskUpdate = (updatedTask) => {
        // Update the task in the appropriate list
        if (updatedTask.isCompleted) {
            setCompletedTasks(completedTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            ));
            setIncompleteTasks(incompleteTasks.filter(task => 
                task.id !== updatedTask.id
            ));
        } else {
            setIncompleteTasks(incompleteTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            ));
            setCompletedTasks(completedTasks.filter(task => 
                task.id !== updatedTask.id
            ));
        }
        
        // Update the selected task
        setSelectedTask(updatedTask);
        
        // Update in the data store
        TaskUtils.updateTask(updatedTask.id, updatedTask);
    };

    // Delete task
    const handleDeleteTask = (taskId) => {
        TaskUtils.deleteTask(taskId);
        
        // Remove from lists
        setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
        setIncompleteTasks(incompleteTasks.filter(task => task.id !== taskId));
        
        // Close sidebar
        setSidebarOpen(false);
        setSelectedTask(null);
    };

    return (
        <div className={`task-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
            <p id="top-text">To Do &#9660;</p>
            <div className="top-input-container">
                <input 
                    type="text" 
                    placeholder="Add a Task"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <div className="features-container">
                    <div className="task-options">
                        {/* Notification Icon with Dropdown */}
                        <div className="option-wrapper">
                            <div onClick={handleNotificationClick}>
                                <NotificationIcon />
                            </div>
                            {showNotificationPicker && (
                                <div className="option-dropdown notification-dropdown">
                                    <h4>Set Reminder</h4>
                                    <input 
                                        type="time" 
                                        value={selectedNotificationTime}
                                        onChange={(e) => setSelectedNotificationTime(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        
                        {/* Repeat Icon with Dropdown */}
                        <div className="option-wrapper">
                            <div onClick={handleRepeatClick}>
                                <RepeatIcon />
                            </div>
                            {showRepeatPicker && (
                                <div className="option-dropdown repeat-dropdown">
                                    <h4>Repeat</h4>
                                    <select 
                                        value={selectedRepeatPattern}
                                        onChange={(e) => setSelectedRepeatPattern(e.target.value)}
                                    >
                                        <option value="none">Don't repeat</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        {/* Today Icon with Dropdown */}
                        <div className="option-wrapper">
                            <div onClick={handleTodayClick}>
                                <TodayIcon />
                            </div>
                            {showDatePicker && (
                                <div className="option-dropdown date-dropdown">
                                    <h4>Due Date</h4>
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
            </div>
            
            <div className="incompleted-task-container">
                {incompleteTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`task task-incomplete ${selectedTask && selectedTask.id === task.id ? 'selected' : ''}`}
                        onClick={() => handleTaskSelect(task)}
                    >
                        <input 
                            type="checkbox" 
                            checked={false}
                            onChange={(e) => handleToggleCompletion(task.id, e)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="task-content">
                            <p className="task-title">{task.title}</p>
                            {task.description && <p className="task-description">{task.description}</p>}
                            <div className="task-meta">
                                {task.steps && task.steps.length > 0 && (
                                    <span className="task-steps-count">
                                        {task.steps.filter(step => step.isCompleted).length}/{task.steps.length}
                                    </span>
                                )}
                                {task.dueDate && (
                                    <div className="task-due-date">
                                        <TodayIcon />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {task.repeatPattern && (
                                    <div className="task-repeat">
                                        <RepeatIcon />
                                        <span>{task.repeatPattern}</span>
                                    </div>
                                )}
                                {task.notifications && task.notifications.length > 0 && (
                                    <div className="task-notification">
                                        <NotificationIcon />
                                        <span>
                                            {new Date(task.notifications[0].time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div 
                            className={`task-star ${task.isImportant ? 'important' : ''}`}
                            onClick={(e) => handleToggleImportance(task.id, e)}
                        >
                            <StarIcon />
                        </div>
                    </div>
                ))}
            </div>
            
            {completedTasks.length > 0 && (
                <div className="completed-task-container">
                    <div 
                        className="completed-header"
                        onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                    >
                        <p>Completed {completedTasks.length > 0 && `(${completedTasks.length})`}</p>
                    </div>
                    
                    {showCompletedTasks && completedTasks.map(task => (
                        <div 
                            key={task.id} 
                            className={`task task-completed ${selectedTask && selectedTask.id === task.id ? 'selected' : ''}`}
                            onClick={() => handleTaskSelect(task)}
                        >
                            <input 
                                type="checkbox" 
                                checked={true}
                                onChange={(e) => handleToggleCompletion(task.id, e)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="task-content">
                                <p className="task-title">{task.title}</p>
                                {task.description && <p className="task-description">{task.description}</p>}
                            </div>
                            <div 
                                className={`task-star ${task.isImportant ? 'important' : ''}`}
                                onClick={(e) => handleToggleImportance(task.id, e)}
                            >
                                <StarIcon />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Task Detail Sidebar */}
            <TaskDetailSidebar 
                task={selectedTask}
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                onUpdate={handleTaskUpdate}
                onDelete={handleDeleteTask}
            />
            
            {/* Overlay when sidebar is open (on mobile) */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={handleCloseSidebar}></div>}
        </div>
    );
};

export default TaskContainer;