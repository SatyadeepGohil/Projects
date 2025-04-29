import React from 'react';

function PokemonCard({ pokemon, onClick }) {
  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <img src={pokemon.image} alt={pokemon.name} />
      <p>{pokemon.name}</p>
      <p>ID: {pokemon.id}</p>
      <div>
        {pokemon.types.map((type) => (
          <span key={type} className={`pokemon-type ${type}`}>{type}</span>
        ))}
      </div>
    </div>
  );
}

export default PokemonCard;