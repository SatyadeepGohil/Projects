import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from '../context/FavoriteContext';
import usePokemonDetail from '../hooks/usePokemonDetail';
import ErrorDisplay from './ErrorDisplay';

const PokemonDetail = () => {
  const { parsedId } = useParams();
  const pokemonId = parseInt(parsedId);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isNaN(parsedId) || parsedId < 1) {
  return <ErrorDisplay type="notfound" message="Invalid Pokémon ID" />;
}

  
  const { pokemon, species, evolution, isLoading, error } = usePokemonDetail(pokemonId);

  
  if (error) {
    return (
      <ErrorDisplay 
        type="api" 
        message={`Failed to load Pokemon #${pokemonId}`} 
        retry={() => navigate(0)}
      />
    );
  }
  
  if (!pokemon) return <div>Pokemon not found</div>;
  
  // Process evolution chain data
  const getEvolutionChain = (evolutionData) => {
    if (!evolutionData?.chain) return [];
    
    const chain = [];
    let currentEvo = evolutionData.chain;
    
    while (currentEvo) {
      const pokemonId = currentEvo.species.url.split('/').slice(-2, -1)[0];
      
      chain.push({
        id: parseInt(pokemonId),
        name: currentEvo.species.name,
        min_level: currentEvo.evolution_details[0]?.min_level || null
      });
      
      currentEvo = currentEvo.evolves_to[0];
    }
    
    return chain;
  };
  
  const evolutionChain = getEvolutionChain(evolution);
  
  return (
    <div className="pokemon-detail">
      <div className="pokemon-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        
        <img 
          src={pokemon.sprites?.other['official-artwork'].front_default || pokemon.sprites.front_default} 
          alt={pokemon.name}
        />
        
        <div className="pokemon-title">
          <h1>{pokemon.name}</h1>
          <p>#{pokemon.id}</p>
          
          <button 
            className={`favorite-button ${isFavorite(pokemon.id) ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(pokemon.id)}
          >
            {isFavorite(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
      
      <div className="pokemon-detail-info">
        <section className="pokemon-types">
          <h3>Types</h3>
          <div className="types-list">
            {pokemon.types.map((type) => (
              <span key={type.type.name} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </section>
        
        <section className="pokemon-stats">
          <h3>Base Stats</h3>
          <div className="stats-list">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="stat-item">
                <span className="stat-name">{stat.stat.name}</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar" 
                    style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                  />
                </div>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="pokemon-abilities">
          <h3>Abilities</h3>
          <ul>
            {pokemon.abilities.map((ability) => (
              <li key={ability.ability.name}>
                {ability.ability.name}
                {ability.is_hidden && <span className="hidden-ability">(Hidden)</span>}
              </li>
            ))}
          </ul>
        </section>
        
        {species && (
          <section className="pokemon-species">
            <h3>Species</h3>
            <p>{species.genera.find(g => g.language.name === 'en')?.genus}</p>
            <p>{species.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text}</p>
          </section>
        )}
        
        {evolutionChain.length > 1 && (
          <section className="pokemon-evolution">
            <h3>Evolution Chain</h3>
            <div className="evolution-chain">
              {evolutionChain.map((evo, index) => (
                <React.Fragment key={evo.id}>
                  <div 
                    className={`evolution-item ${evo.id === parseInt(pokemonId) ? 'current' : ''}`}
                    onClick={() => navigate(`/pokemon/${evo.id}`)}
                  >
                    <span className="evolution-name">{evo.name}</span>
                    <span className="evolution-id">#{evo.id}</span>
                  </div>
                  {index < evolutionChain.length - 1 && (
                    <div className="evolution-arrow">
                      {evolutionChain[index + 1].min_level ? 
                        `Level ${evolutionChain[index + 1].min_level} →` : 
                        '→'}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;