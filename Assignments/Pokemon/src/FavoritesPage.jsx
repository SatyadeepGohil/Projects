import React, { useState, useEffect } from "react";
import { useFavorites } from "./context/FavoriteContext";
import { Link } from "react-router-dom";
import PokemonCard from "./components/PokemonCard";
import PokemonGrid from "./components/PokemonGrid";
import ErrorDisplay from "./components/ErrorDisplay";
import { fetcher } from "./utils/fetcher";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoritePokemons([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const results = await Promise.all(
          favorites.map(id => 
            fetcher(`https://pokeapi.co/api/v2/pokemon/${id}`).catch(err => {
              console.error(`Failed to fetch Pokemon #${id}`, err);
              return null;
            })
          )
        );
        
        const validResults = results.filter(Boolean).map(details => ({
          id: details.id,
          name: details.name,
          image: details.sprites?.front_default || details.sprites?.other?.['official-artwork']?.front_default,
          types: details.types.map(t => t.type.name)
        }));
        
        setFavoritePokemons(validResults);
      } catch (err) {
        setError('Failed to fetch favorite Pokemon');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [favorites]);
  
  if (loading) {
    return (
      <div className="favorites-page">
        <h2>Your Favorite Pokémon</h2>
        <div className="pokemon-grid">
          {Array(favorites.length).fill(0).map((_, idx) => (
            <PokemonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return <ErrorDisplay type="api" message={error} />;
  }
  
  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h2>Your Favorite Pokémon</h2>
        <div className="no-favorites">
          <p>You haven't added any Pokémon to your favorites yet.</p>
          <Link to="/" className="button">
            Browse Pokémon
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="favorites-page">
      <h2>Your Favorite Pokémon</h2>
      <PokemonGrid pokemons={favoritePokemons} loading={false} />
    </div>
  );
};

export default FavoritesPage;