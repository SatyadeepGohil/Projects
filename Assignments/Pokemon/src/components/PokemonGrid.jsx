import PokemonCard from "./PokemonCard";

const PokemonGrid = ({ pokemons, loading }) => {
    if (loading) {
        return (
            <div className="pokemon-container">
                {Array(10).fill(0).map((_, idx) => (
                    <PokemonCard key={idx} loading />
                ))}
            </div>
        );
    }

    if (!pokemons || pokemons.length === 0) {
        return <div className="no-results">No Pokemon found</div>;
    }

    return (
        <div className="pokemon-container">
            {pokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
    );
};

export default PokemonGrid;
