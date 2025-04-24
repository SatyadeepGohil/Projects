import React, { useState, useEffect } from 'react';

const CryptoFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        nameSearch: '',
        minPrice: '',
        maxPrice: '',
        priceChangeFilter: 'all'
    });

    useEffect(() => {
        const savedFilters = localStorage.getItem('cryptoFilters');
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            setFilters(parsedFilters);
            onFilterChange(parsedFilters);
        }
    }, [onFilterChange]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        
        const newFilters = {
            ...filters,
            [name]: value
        };

        setFilters(newFilters);
        localStorage.setItem('cryptoFilters', JSON.stringify(newFilters));
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            nameSearch: '',
            minPrice: '',
            maxPrice: '',
            priceChangeFilter: 'all',
        };

        setFilters(defaultFilters);
        localStorage.setItem('cryptoFilters', JSON.stringify(defaultFilters));
        onFilterChange(defaultFilters);
    };

      return (
        <div className="crypto-filters">
            <div className="filter-group">
                <input
                type="text"
                name="nameSearch"
                placeholder="Search by name or symbol"
                value={filters.nameSearch}
                onChange={handleFilterChange}
                className="filter-input"
                />
            </div>
            
            <div className="filter-group price-range">
                <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
                />
                <span>to</span>
                <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
                />
            </div>
            
            <div className="filter-group">
                <select
                name="priceChangeFilter"
                value={filters.priceChangeFilter}
                onChange={handleFilterChange}
                className="filter-select"
                >
                <option value="all">All Price Changes</option>
                <option value="positive">Gainers (24h)</option>
                <option value="negative">Losers (24h)</option>
                </select>
            </div>
            
            <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
            </button>
        </div>
  );
}

export default CryptoFilters;