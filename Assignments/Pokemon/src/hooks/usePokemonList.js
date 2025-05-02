import useSWR from "swr";
import { fetcher } from "../utils/fetcher";

export const usePokemonList = ( limit = 150 ) => {
    const {data, error, isLoading} = useSWR(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`, 
    fetcher,
    { revalidateOnFocus: false }
);

if (error) {
    console.error('Error fetching Pokemon list', error);
    return {
        pokemonList: null,
        isLoading: false,
        error
    };
}

    return {
        pokemonList: data,
        isLoading,
        error
    };
};