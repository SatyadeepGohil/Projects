import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faPalette, faCheck } from "@fortawesome/free-solid-svg-icons";

const ListSidebar = ({ lists, selectedList, setSelectedList, addNewList }) => {
  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4caf50");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const colors = [
    "#4caf50", // Green
    "#2196f3", // Blue
    "#f44336", // Red
    "#ff9800", // Orange
    "#9c27b0", // Purple
    "#607d8b", // Blue Grey
    "#795548", // Brown
    "#e91e63"  // Pink
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = addNewList(newListName, selectedColor);
      setSelectedList(newList);
      setNewListName("");
      setShowAddListForm(false);
      setShowColorPicker(false);
    }
  };
  
  return (
    <div className="list-sidebar">
      <div className="list-header">
        <h3>My Lists</h3>
      </div>
      
      <div className="lists-container">
        {lists.map(list => (
          <div
            key={list.id}
            className={`list-item ${selectedList && selectedList.id === list.id ? 'active' : ''}`}
            onClick={() => setSelectedList(list)}
          >
            <div 
              className="list-color-indicator" 
              style={{ backgroundColor: list.color }}
            ></div>
            <span className="list-name">{list.name}</span>
          </div>
        ))}
      </div>
      
      {!showAddListForm ? (
        <div 
          className="add-list-button"
          onClick={() => setShowAddListForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add new list</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="add-list-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              autoFocus
            />
            <div className="color-selector">
              <div 
                className="selected-color" 
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <FontAwesomeIcon icon={faPalette} className="color-icon" />
              </div>
              
              {showColorPicker && (
                <div className="color-picker">
                  {colors.map(color => (
                    <div 
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                    >
                      {color === selectedColor && (
                        <FontAwesomeIcon icon={faCheck} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setShowAddListForm(false);
                setNewListName("");
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="add-button"
              disabled={!newListName.trim()}
            >
              Add List
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ListSidebar;