import React from 'react';
import { useFavorites } from '../context/FavoriteContext';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

function PokemonCard({ pokemon, loading = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="pokemon-card">
        <div className="favorite-toggle">
          <Skeleton variant="text" width={24} />
        </div>
        <div className="pokemon-image">
          <Skeleton variant="rectangular" width={100} height={100} />
        </div>
        <div className="pokemon-info">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
          <div className="pokemon-types">
            <Skeleton variant="text" width={60} />
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div 
      className="pokemon-card" 
      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
    >
      <div className="favorite-toggle" onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(pokemon.id);
      }}>
        {isFavorite(pokemon.id) ? '★' : '☆'}
      </div>
      
      <div className="pokemon-image">
        {pokemon.image ? (
          <img src={pokemon.image} alt={pokemon.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="pokemon-info">
        <h3>{pokemon.name}</h3>
        <p>#{pokemon.id}</p>
        <div className="pokemon-types">
          {pokemon.types && pokemon.types.map((type, index) => (
            <span key={index} className={`type ${type}`}>{type}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;