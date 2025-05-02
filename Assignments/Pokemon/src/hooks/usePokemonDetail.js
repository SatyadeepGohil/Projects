import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

const usePokemonDetail = (pokemonId) => {
  const { data: pokemon, error: pokemonError, isLoading: loadingPokemon } = useSWR(
    pokemonId ? `https://pokeapi.co/api/v2/pokemon/${pokemonId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: species, error: speciesError, isLoading: loadingSpecies } = useSWR(
    pokemon?.species?.url || null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: evolution, error: evolutionError, isLoading: loadingEvolution } = useSWR(
    species?.evolution_chain?.url || null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    pokemon,
    species,
    evolution,
    isLoading: loadingPokemon || loadingSpecies || loadingEvolution,
    error: pokemonError || speciesError || evolutionError,
  };
};

export default usePokemonDetail;