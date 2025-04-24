import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllAssets } from '../features/crypto/cryptoSlice';
import CryptoTableRow from './CryptoTableRow';
import CryptoFilters from './CryptoFilters';

export default function CryptoTable() {
  const assets = useSelector(selectAllAssets);
  const [filters, setFilters] = useState({
    nameSearch: '',
    minPrice: '',
    maxPrice: '',
    priceChangeFilter: 'all',
  });

  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem('sortConfig');
    return saved ? JSON.parse(saved) : { key: 'market_cap', direction: 'descending' };
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const term = filters.nameSearch.toLowerCase();
      if (filters.nameSearch && !(
        asset.name.toLowerCase().includes(term) ||
        asset.symbol.toLowerCase().includes(term)
      )) {
        return false;
      }
      if (filters.minPrice && asset.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && asset.price > parseFloat(filters.maxPrice)) return false;
      if (filters.priceChangeFilter === 'positive' && asset.percent_change_24h <= 0) return false;
      if (filters.priceChangeFilter === 'negative' && asset.percent_change_24h >= 0) return false;
      return true;
    });
  }, [assets, filters]);

  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredAssets, sortConfig]);

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const newConfig = { key, direction };
    setSortConfig(newConfig);
    localStorage.setItem('sortConfig', JSON.stringify(newConfig));
  };

  const getSortIndicator = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <div className="crypto-tracker-container">
      <CryptoFilters onFilterChange={handleFilterChange} />

      <div className="table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}># {getSortIndicator('id')}</th>
              <th>Logo</th>
              <th onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</th>
              <th onClick={() => requestSort('symbol')}>Symbol {getSortIndicator('symbol')}</th>
              <th onClick={() => requestSort('price')}>Price {getSortIndicator('price')}</th>
              <th onClick={() => requestSort('percent_change_1h')}>1h % {getSortIndicator('percent_change_1h')}</th>
              <th onClick={() => requestSort('percent_change_24h')}>24h % {getSortIndicator('percent_change_24h')}</th>
              <th onClick={() => requestSort('percent_change_7d')}>7d % {getSortIndicator('percent_change_7d')}</th>
              <th onClick={() => requestSort('market_cap')}>Market Cap {getSortIndicator('market_cap')}</th>
              <th onClick={() => requestSort('volume_24h')}>24h Volume {getSortIndicator('volume_24h')}</th>
              <th onClick={() => requestSort('circulating_supply')}>Circulating Supply {getSortIndicator('circulating_supply')}</th>
              <th onClick={() => requestSort('max_supply')}>Max Supply {getSortIndicator('max_supply')}</th>
              <th>7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.length > 0 ? (
              sortedAssets.map(asset => (
                <CryptoTableRow key={asset.id} asset={asset} />
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-data">
                  No cryptocurrencies match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}