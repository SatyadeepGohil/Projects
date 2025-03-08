import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faPlus, faInfo, faSearch } from "@fortawesome/free-solid-svg-icons";
import NavLogo from '../src/assets/nav-logo.svg';
import CardIcon from '../src/assets/card.svg';
import MoonIcon from '../src/assets/moon.svg';
import AllTasksIcon from '../src/assets/Icon/AllTasksIcon';
import TodayIcon from '../src/assets/Icon/TodayIcon';
import StarIcon from '../src/assets/Icon/StarIcon';
import PlanIcon from '../src/assets/Icon/PlanIcon';
import AssignedIcon from '../src/assets/Icon/AssignedIcon';
import TaskCompletionChart from './TaskCompletionChart';

const SidebarNav = ({ 
  setSelectedFilter, 
  todayTasksCount = 0, 
  onSearchClick,
  completedTasksCount = 0,
  totalTasksCount = 0
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setActiveFilter(filter);
        
        // On mobile, close the sidebar after selection
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const completionPercentage = totalTasksCount > 0 
      ? Math.round((completedTasksCount / totalTasksCount) * 100) 
      : 0;

    return (
        <>
            <nav>
                <div id="logo-container">
                    <FontAwesomeIcon 
                        icon={faBars} 
                        className={`menu-icon ${isSidebarOpen ? 'hidden' : ''}`} 
                        onClick={() => setIsSidebarOpen(true)} 
                    />
                    <FontAwesomeIcon 
                        icon={faXmark} 
                        className={`close-icon ${isSidebarOpen ? '' : 'hidden'}`} 
                        onClick={() => setIsSidebarOpen(false)} 
                    />
                    <img src={NavLogo} alt="Atom icon with Do it text in a green color" />
                </div>
                <div id="nav-features-container">
                    <div className="search-icon-wrapper" onClick={onSearchClick}>
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                    <img src={CardIcon} alt="Card Icon" />
                    <img src={MoonIcon} alt="Moon icon" />
                </div>
            </nav>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div id="user-image-container">
                    <img src="" alt="user's image"/>
                    <p>Hey, Abcd</p>
                </div>
                
                <div className="task-completion-chart-container">
                    <TaskCompletionChart 
                        completedTasksCount={completedTasksCount}
                        totalTasksCount={totalTasksCount}
                    />
                    <div className="completion-stats">
                        <span className="completion-percentage">{completionPercentage}%</span>
                        <span className="completion-label">completed</span>
                    </div>
                </div>
                
                <div id="sidebar-filter-container">
                    <div 
                        className={`filters ${activeFilter === 'all' ? 'active' : ''}`} 
                        onClick={() => handleFilterSelect('all')}
                    >
                        <AllTasksIcon />
                        <p>All Tasks</p>
                    </div>
                    <div 
                        className={`filters ${activeFilter === 'today' ? 'active' : ''}`} 
                        onClick={() => handleFilterSelect('today')}
                    >
                        <TodayIcon />
                        <p>Today</p>
                    </div>
                    <div 
                        className={`filters ${activeFilter === 'important' ? 'active' : ''}`} 
                        onClick={() => handleFilterSelect('important')}
                    >
                        <StarIcon />
                        <p>Important</p>
                    </div>
                    <div 
                        className={`filters ${activeFilter === 'planned' ? 'active' : ''}`} 
                        onClick={() => handleFilterSelect('planned')}
                    >
                        <PlanIcon />
                        <p>Planned</p>
                    </div>
                    <div 
                        className={`filters ${activeFilter === 'assigned' ? 'active' : ''}`} 
                        onClick={() => handleFilterSelect('assigned')}
                    >
                        <AssignedIcon />
                        <p>Assigned to me</p>
                    </div>
                </div>
                
                <div id="Task-track-container">
                    <div>
                        <p>
                            Today Tasks
                            <span>{todayTasksCount}</span>
                        </p>
                        <FontAwesomeIcon icon={faInfo} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidebarNav;