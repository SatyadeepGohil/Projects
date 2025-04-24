import React, { memo, useState, useEffect } from 'react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatLargeNumber = (value) => {
  if (value === null) return 'N/A';
  
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else {
    return formatCurrency(value);
  }
};

const generateSparkline = (positive) => {
  const points = [];
  let prevY = 50 + (Math.random() * 20 - 10);
  
  for (let i = 0; i < 20; i++) {
    const x = i * 5;
    const change = Math.random() * 10 - (positive ? 3 : 7);
    const y = Math.max(10, Math.min(90, prevY + change));
    points.push(`${x},${y}`);
    prevY = y;
  }
  
  const pointsStr = points.join(' ');
  const color = positive ? "#16c784" : "#ea3943";
  
  return (
    <svg width="100" height="40" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={pointsStr}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

const CryptoTableRow = ({ asset }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(asset.id));
  }, [asset.id]);
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== asset.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(asset.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  const {
    id,
    name,
    symbol,
    logo,
    price,
    percent_change_1h,
    percent_change_24h,
    percent_change_7d,
    market_cap,
    volume_24h,
    circulating_supply,
    max_supply
  } = asset;

  const getPercentClass = (value) => {
    return value >= 0 ? 'percent-positive' : 'percent-negative';
  };

  return (
    <tr className={`crypto-row ${isFavorite ? 'favorite-row' : ''}`}>
      <td>
        <span className="favorite-toggle" onClick={toggleFavorite}>
          {isFavorite ? '★' : '☆'}
        </span>
        {id}
      </td>
      <td><img src={logo} alt={`${symbol} logo`} className="crypto-logo" /></td>
      <td className="crypto-name">{name}</td>
      <td>{symbol}</td>
      <td className="price">{formatCurrency(price)}</td>
      <td className={getPercentClass(percent_change_1h)}>
        {percent_change_1h > 0 ? '+' : ''}{percent_change_1h.toFixed(2)}%
      </td>
      <td className={getPercentClass(percent_change_24h)}>
        {percent_change_24h > 0 ? '+' : ''}{percent_change_24h.toFixed(2)}%
      </td>
      <td className={getPercentClass(percent_change_7d)}>
        {percent_change_7d > 0 ? '+' : ''}{percent_change_7d.toFixed(2)}%
      </td>
      <td>{formatLargeNumber(market_cap)}</td>
      <td>{formatLargeNumber(volume_24h)}</td>
      <td>{circulating_supply.toLocaleString()} {symbol}</td>
      <td>{max_supply ? max_supply.toLocaleString() + ' ' + symbol : 'N/A'}</td>
      <td className="chart-cell">{generateSparkline(percent_change_7d > 0)}</td>
    </tr>
  );
};

export default memo(CryptoTableRow);