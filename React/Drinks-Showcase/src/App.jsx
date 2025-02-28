import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import '../src/App.css';

function App() {
  const [cards, setCards] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.sampleapis.com/beers/ale');
        setCards(response.data);
      } catch (error) {
        console.error('There is some error during fetching the data', error);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating) => {
    const safeRating = typeof rating === 'number' ? Math.min(Math.max(rating, 0), 5) : 0;
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} style={{ color: 'gold' }} />
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: 'gold' }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStarRegular} style={{ color: 'grey' }} />
        ))}
      </>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue);
    }
  };

  const filteredCards = cards
    ? cards.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (filter === 'price-desc') {
      return (
        parseFloat(b.price.replace(/[^0-9.]/g, '')) -
        parseFloat(a.price.replace(/[^0-9.]/g, ''))
      );
    } else if (filter === 'price-asc') {
      return (
        parseFloat(a.price.replace(/[^0-9.]/g, '')) -
        parseFloat(b.price.replace(/[^0-9.]/g, ''))
      );
    } else if (filter === 'rating-desc') {
      return b.rating.average - a.rating.average;
    } else if (filter === 'rating-asc') {
      return a.rating.average - b.rating.average;
    }
    return 0;
  });

  return (
    <div id="container">
      <div id="top-container">
        <div id="search-container">
          <input
            type="text"
            placeholder="Search here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <div id="filter-container">
          <select
            name="filter"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="price-desc">High to Low</option>
            <option value="price-asc">Low to High</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
          </select>
        </div>
      </div>
      <div id="card-container">
        {sortedCards.map((card) => (
          <div className="card" key={card.id}>
            <img src={card.image} alt={card.name} />
            <h3>{card.name}</h3>
            <p>{card.price}</p>
            <div className="rating">
              {renderStars(card.rating.average)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
