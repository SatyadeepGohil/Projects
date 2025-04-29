import React, { useCallback, useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [types, setTypes] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_default,
              types: details.types.map(t => t.type.name),
            };
          })
        );

        setPokemons(pokemonDetails);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        setIsLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  useEffect(() => {
    async function fetchTypes () {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/type');
        const data = await await res.json();
        setTypes(data.results.map(type => type.name));
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    }

    fetchTypes();
  }, [])

  const filteredPokemons = useCallback(() => {
    return pokemons.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(searchInput.toLowerCase());
    const matchesType = typeFilter === 'all' || pokemon.types.includes(typeFilter);
    return matchesName && matchesType;
  });
  }, [pokemons, searchInput, typeFilter]);

  return (
    <>
    <header>
      <h1>
        Pokemon Finder
      </h1>
    </header>
    <main>
      <input type="text"
      value={searchInput}
      placeholder='Search Pokemon...'
      onChange={(e) => setSearchInput(e.target.value)}
      />

      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="all">All Types</option>
        {types.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className='pokemon-container'>
          {filteredPokemons().length > 0 ? (
            filteredPokemons().map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} onClick={setSelectedPokemon}/>
            ))
          ) : (
            <p>No Pokémon found!</p>
          )}
        </div>
      )}
      
      {selectedPokemon && (
        <>
          <div className="overlay" onClick={() => setSelectedPokemon(null)} />
          <div className="modal show">
            <button className={'close-btn'} onClick={() => setSelectedPokemon(null)}>×</button>
            <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            <h2>{selectedPokemon.name}</h2>
            <div>
              {selectedPokemon.types.map((type) => (
                <span key={type} className={`pokemon-type ${type}`}>{type}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
    </>
  )
}

export default App;