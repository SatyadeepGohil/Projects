import React, { useMemo, useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PokemonGrid from './components/PokemonGrid';
import { useAdvancedSearch } from './hooks/useAdvancedSearch';
import usePaginatedPokemon from './hooks/usePaginatedPokemon';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';

function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchLogic, setSearchLogic] = useState('AND');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState([]);
  const [allTypes, setAllTypes] = useState([]);


  const {
    paginatedData,
    page,
    setPage,
    totalPages,
    loading,
    error,
    hasMore,
  } = usePaginatedPokemon(itemsPerPage, sortBy, sortOrder, typeFilter);


  const fuse = useMemo(() => {
    return new Fuse(paginatedData, {
      keys: ['name', 'id', 'types'],
      threshold: 0.4,
      includeScore: true,
    });
  }, [paginatedData]);

  const filteredPokemons = useAdvancedSearch({
    array: paginatedData,
    searchInput,
    advanceSearch: advancedSearch,
    searchLogic,
    fuse,
  });

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/type');
        const data = await res.json();
        const filtered = data.results
          .map((type) => type.name)
          .filter((name) => name !== 'unknown' && name !== 'shadow');
        setAllTypes(filtered);
      } catch (err) {
        console.error("Failed to fetch types", err);
      }
    }
    fetchTypes();
  }, []);

   console.log({ paginatedData, filteredPokemons, loading });

  return (
    <>
    <header>
      <h1>
        Pokemon Finder
      </h1>
    </header>
    <nav>
      <Link to={'/favorites'}>
        Favorites
      </Link>
      <Link to={'/compare'}>
        Comparison
      </Link>
    </nav>
    <main>
      <SearchBar 
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        searchLogic={searchLogic}
        setSearchLogic={setSearchLogic}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        allTypes={allTypes}
      />  
    </main>

    <PokemonGrid pokemons={filteredPokemons} loading={loading} />
    
    <div className='pagination-controls'>
      <button onClick={() => setPage((p) => Math.max(1, p - 1))}
       disabled={page === 1}
       >
        Prev
      </button>
      <span>
        Page {page} of {totalPages || 1}
      </span>
      <button 
      onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
      disabled={page === totalPages || totalPages === 0}
      >
        Next
      </button>

      <select 
      value={itemsPerPage} 
      onChange={(e) => {
        const newValue = Number(e.target.value);
        setItemsPerPage(newValue);
        setPage(1);
      }}
      >
        {[10, 20, 50].map((val, index) => (
          <option key={index} value={val}>
            {val} per page
          </option>
        ))}
      </select>
    </div>
    </>
  )
}

export default HomePage;