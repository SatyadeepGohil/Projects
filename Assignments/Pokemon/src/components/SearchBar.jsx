import React from "react";

const SearchBar = ({
  searchInput,
  setSearchInput,
  advancedSearch,
  setAdvancedSearch,
  searchLogic,
  setSearchLogic,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  typeFilter,
  setTypeFilter,
  allTypes
}) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchInput}
          placeholder="Search Pokemon..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      
      <div className="search-options">
        <div className="advanced-search-toggle">
          <label>
            <input
              type="checkbox"
              checked={advancedSearch}
              onChange={() => setAdvancedSearch(!advancedSearch)}
            />
            Advanced Search
          </label>
          
          {advancedSearch && (
            <div className="search-logic">
              <label>
                <input
                  type="radio"
                  name="searchLogic"
                  value="AND"
                  checked={searchLogic === 'AND'}
                  onChange={() => setSearchLogic('AND')}
                />
                Match ALL words
              </label>
              <label>
                <input
                  type="radio"
                  name="searchLogic"
                  value="OR"
                  checked={searchLogic === 'OR'}
                  onChange={() => setSearchLogic('OR')}
                />
                Match ANY word
              </label>
            </div>
          )}
        </div>
        
        <div className="sort-options">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        {allTypes && allTypes.length > 0 && (
          <div className="type-filter">
            <span>Filter by type:</span>
            <div className="type-options">
              {allTypes.map(type => (
                <label key={type} className={`type-option ${type}`}>
                  <input
                    type="checkbox"
                    checked={typeFilter.includes(type)}
                    onChange={() => {
                      if (typeFilter.includes(type)) {
                        setTypeFilter(typeFilter.filter(t => t !== type));
                      } else {
                        setTypeFilter([...typeFilter, type]);
                      }
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;