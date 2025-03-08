import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faPlus, faInfo } from "@fortawesome/free-solid-svg-icons";
import NavLogo from '../src/assets/nav-logo.svg';
import SearchIcon from '../src/assets/search-icon.svg';
import ListIcon from '../src/assets/list.svg';
import CardIcon from '../src/assets/card.svg';
import MoonIcon from '../src/assets/moon.svg';
import SunIcon from '../src/assets/sun.svg';
import AllTasksIcon from '../src/assets/Icon/AllTasksIcon';
import TodayIcon from '../src/assets/Icon/TodayIcon';
import StarIcon from '../src/assets/Icon/StarIcon';
import PlanIcon from '../src/assets/Icon/PlanIcon';
import AssignedIcon from '../src/assets/Icon/AssignedIcon';

const SidebarNav = ({ setSelectedFilter }) => {
    return (
        <>
            <nav>
                <div id="logo-container">
                    <FontAwesomeIcon icon={faBars} />
                    <FontAwesomeIcon icon={faXmark} />
                    <img src={NavLogo} alt="Atom icon with Do it text in a green color" />
                </div>
                <div id="nav-features-container">
                    <img src={SearchIcon} alt="search icon" />
                    <img src={CardIcon} alt={CardIcon ? 'Card Icon' : 'List Icon'} />
                    <img src={MoonIcon} alt={MoonIcon ? 'Moon icon' : 'Sun icon'} />
                </div>
            </nav>
            <div className="sidebar">
                <div id="user-image-container">
                    <img src="" alt="user's image"/>
                    <p>Hey, Abcd</p>
                </div>
                <div id="sidebar-filter-container">
                    <div className="filters" onClick={() => setSelectedFilter('all')}>
                        <AllTasksIcon />
                        <p>All Tasks</p>
                    </div>
                    <div className="filters" onClick={() => setSelectedFilter('today')}>
                        <TodayIcon />
                        <p>Today</p>
                    </div>
                    <div className="filters" onClick={() => setSelectedFilter('important')}>
                        <StarIcon />
                        <p>Important</p>
                    </div>
                    <div className="filters" onClick={() => setSelectedFilter('planned')}>
                        <PlanIcon />
                        <p>Planned</p>
                    </div>
                    <div className="filters" onClick={() => setSelectedFilter('assinged')}>
                        <AssignedIcon />
                        <p>Assinged to me</p>
                    </div>
                </div>
                <div id="add-list-container">
                    <FontAwesomeIcon icon={faPlus} />
                    <p>Add list</p>
                </div>
                <div id="Task-track-container">
                    <div>
                        <p>
                            Toady Tasks
                            <span>11</span>
                        </p>
                        <FontAwesomeIcon icon={faInfo} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SidebarNav;