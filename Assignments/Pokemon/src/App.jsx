import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import PokemonCard from './PokemonCard';
import './App.css'
import Fuse from 'fuse.js';

const fetcher = (url) => fetch(url).then((res) => res.json());

const FetchPokemonError = ({ message }) => {
  return (
    <p>{message || `An error occcured during fetching connecting with database of pokemon, Please try again later or refresh the page`}</p>
  )
}

function App() {
  const BATCH_SIZE = 50;
  const MAX_BATCHES = 3;

  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchLogic, setSearchLogic] = useState('AND');
  const [batchLoading, setBatchLodading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  const { data: pokemonData, error: pokemonDataError} = useSWR('https://pokeapi.co/api/v2/pokemon?limit=150', fetcher);

  const { data: typeData, } = useSWR('https://pokeapi.co/api/v2/type', fetcher);

  const types = typeData?.results?.map((type) => type.name) || [];

  // Debug for what's happening behind the scences
   useEffect(() => {
    console.log("Current pokemon count:", pokemons.length);
    console.log("Loading state:", isLoading);
    console.log("Batch index:", batchIndex);
  }, [pokemons,isLoading, batchIndex]);

  const loadBatch = async () => {
    if (!pokemonData?.results || batchLoading || batchIndex >= MAX_BATCHES) return;

    setBatchLodading(true);
    setBatchError(null);
    const allResults = pokemonData.results;
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batch = allResults.slice(start, end);

    try {
      console.log('Loading Pokemon data batch', batchIndex + 1);
      const detailResponses = await Promise.all(
        batch.map((p) => fetcher(p.url).catch(error => {
          console.error(`Failed to fetch ${p.name}:`, error)
          return null;
        }))
      );

      const structured = detailResponses
      .filter(details => details !== null)
      .map((details) => ({
        id: details.id,
        name: details.name,
        image: details.sprites.front_default || details.sprites.other?.['official-artwork']?.front_default,
        types: details.types.map((t) => t.type.name),
      }));

      setPokemons((prev) => [...prev, ...structured]);
      setBatchIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Batch load error:', error);
      setBatchError('Failed to load Pokemon. Please try again');
    } finally {
      setBatchLodading(false);
      if (batchIndex === 0) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (batchIndex === 0 && pokemonData?.results && !batchLoading) {
      loadBatch();
    }
  }, [pokemonData, batchIndex, loadBatch, batchLoading]);

  const fuse = useMemo(() => {
    return new Fuse(pokemons, {
      keys: ['name', 'id', 'types'],
      threshold: 0.4,
      includeScore: true
    });
  }, [pokemons]);
  
  const filteredPokemons = useMemo(() => {
    if (pokemons.length === 0) return [];
    let filtered = [...pokemons];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(pokemon => pokemon.types.includes(typeFilter));
    }

    if (!searchInput.trim()) return filtered;

    // Advance search logic when choosen
    if (advancedSearch) {
      const searchTerms = searchInput.toLowerCase().split(' ');

      // AND search logic
      if (searchLogic === 'AND') {
        return filtered.filter(pokemon => 
          searchTerms.every(term => {
            const results = fuse.search(term);
            return results.some(result => result.item.id === pokemon.id);
          })
        )
      } else {
        // any term can be matched using this (or logic)
        const matchedIds = new Set();
        searchTerms.forEach(term => {
          const results = fuse.search(term);
          results.forEach(result => matchedIds.add(result.item.id));
        });
        return filtered.filter(pokemon => matchedIds.has(pokemon.id));
      }
    } else {
      // simple search
      return filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    }
  }, [pokemons, searchInput, typeFilter, advancedSearch, searchLogic, fuse]);

  const renderContent = () => {
    if (isLoading) {
      return <div className='loading'>Loading Pokemon data...</div>
    }

    if (filteredPokemons.length === 0) {
      return <p>No Pokemon found matching your criteria!</p>
    }

    return (
      <div className='pokemon-container'>
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={setSelectedPokemon}
          />
        ))}
      </div>
    )
  }

  if (pokemonDataError) return <FetchPokemonError />;

  return (
    <>
    <header>
      <h1>
        Pokemon Finder
      </h1>
    </header>
    <main>
    <div className="search-container">
        <input
          type="text"
          value={searchInput}
          placeholder="Search Pokemon..."
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        
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
      </div>

      {renderContent()}

      {batchError && <FetchPokemonError message={batchError}/>}

      {!isLoading && batchIndex < MAX_BATCHES && (
        <button 
          onClick={loadBatch} 
          className='load-more'
          disabled={batchLoading}
          >
            Load More
          </button>
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