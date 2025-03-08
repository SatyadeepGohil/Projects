import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import NotificationIcon from "../src/assets/Icon/NotificationIcon";
import TodayIcon from "../src/assets/Icon/TodayIcon";
import RepeatIcon from "../src/assets/Icon/ReapeatIcon";
import StarIcon from "../src/assets/Icon/StarIcon";
import TaskUtils from "../src/TaskUtils";

const TaskDetailSidebar = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
    const [localTask, setLocalTask] = useState(null);
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([]);
    const [newStep, setNewStep] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [repeatPattern, setRepeatPattern] = useState(null);
    
    // Initialize local state when task changes
    useEffect(() => {
        if (task) {
            setLocalTask(task);
            setDescription(task.description || "");
            setSteps(task.steps || []);
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
            setRepeatPattern(task.repeatPattern || null);
        }
    }, [task]);

    if (!task || !localTask) return null;

    // Format creation date nicely
    const formatCreationDate = (dateString) => {
        const date = new Date(dateString);
        return `Created on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    // Handle task completion toggle
    const handleToggleCompletion = () => {
        const updatedTask = { ...localTask, isCompleted: !localTask.isCompleted };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Handle task importance toggle
    const handleToggleImportance = () => {
        const updatedTask = { ...localTask, isImportant: !localTask.isImportant };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Add a new step to the task
    const handleAddStep = () => {
        if (newStep.trim() === "") return;
        
        const updatedSteps = [...steps, { id: Date.now(), title: newStep, isCompleted: false }];
        setSteps(updatedSteps);
        setNewStep("");
        
        const updatedTask = { ...localTask, steps: updatedSteps };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Toggle step completion
    const handleToggleStepCompletion = (stepId) => {
        const updatedSteps = steps.map(step => 
            step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
        );
        
        setSteps(updatedSteps);
        
        const updatedTask = { ...localTask, steps: updatedSteps };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Update task description
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    // Save description when user stops typing
    const handleDescriptionBlur = () => {
        const updatedTask = { ...localTask, description };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Update due date
    const handleDueDateChange = (e) => {
        const newDueDate = e.target.value;
        setDueDate(newDueDate);
        
        const updatedTask = { 
            ...localTask, 
            dueDate: newDueDate ? new Date(newDueDate).toISOString() : null 
        };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    // Update repeat pattern
    const handleRepeatChange = (e) => {
        const newPattern = e.target.value === "none" ? null : e.target.value;
        setRepeatPattern(newPattern);
        
        const updatedTask = { ...localTask, repeatPattern: newPattern };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };

    return (
        <div className={`task-detail-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="task-detail-header">
                <div className="task-summary">
                    <input 
                        type="checkbox" 
                        checked={localTask.isCompleted}
                        onChange={handleToggleCompletion}
                    />
                    <h3>{localTask.title}</h3>
                    <div 
                        className={`task-star ${localTask.isImportant ? 'important' : ''}`}
                        onClick={handleToggleImportance}
                    >
                        <StarIcon />
                    </div>
                </div>
            </div>
            
            <div className="task-detail-content">
                {/* Add steps section */}
                <div className="task-detail-section">
                    <h4>Steps</h4>
                    <div className="task-steps">
                        {steps.map(step => (
                            <div key={step.id} className="task-step">
                                <input 
                                    type="checkbox" 
                                    checked={step.isCompleted}
                                    onChange={() => handleToggleStepCompletion(step.id)}
                                />
                                <span className={step.isCompleted ? 'completed' : ''}>{step.title}</span>
                            </div>
                        ))}
                        
                        <div className="add-step">
                            <FontAwesomeIcon icon={faPlus} />
                            <input 
                                type="text" 
                                placeholder="Add step" 
                                value={newStep}
                                onChange={(e) => setNewStep(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                            />
                            <button onClick={handleAddStep}>Add</button>
                        </div>
                    </div>
                </div>
                
                {/* Reminders section */}
                <div className="task-detail-section">
                    <div className="detail-row">
                        <NotificationIcon />
                        <span>Set reminder</span>
                    </div>
                </div>
                
                {/* Due date section */}
                <div className="task-detail-section">
                    <div className="detail-row">
                        <TodayIcon />
                        <span>Due date</span>
                        <input 
                            type="date" 
                            value={dueDate}
                            onChange={handleDueDateChange}
                        />
                    </div>
                </div>
                
                {/* Repeat section */}
                <div className="task-detail-section">
                    <div className="detail-row">
                        <RepeatIcon />
                        <span>Repeat</span>
                        <select 
                            value={repeatPattern || "none"}
                            onChange={handleRepeatChange}
                        >
                            <option value="none">Don't repeat</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                
                {/* Description textarea */}
                <div className="task-detail-section">
                    <textarea 
                        placeholder="Add description" 
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={handleDescriptionBlur}
                    ></textarea>
                </div>
            </div>
            
            <div className="task-detail-footer">
                <div className="task-creation-date">
                    {formatCreationDate(localTask.creationDate)}
                </div>
                <div className="task-actions">
                    <FontAwesomeIcon 
                        icon={faXmark} 
                        className="close-icon"
                        onClick={onClose}
                    />
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        className="delete-icon"
                        onClick={() => onDelete(localTask.id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskDetailSidebar;