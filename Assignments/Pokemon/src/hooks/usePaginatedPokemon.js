import { useEffect, useState } from "react";
import { usePokemonList } from "./usePokemonList";
import { useDeepMemo } from './useDeepMemo';
import { fetcher } from "../utils/fetcher";

export default function usePaginatedPokemon(itemsPerPage = 10, sortBy = 'id', sortOrder = 'asc', typeFilter= []) {
    const [page, setPage] = useState(1);
    const MAX_POKEMON = 150;
    
    const { pokemonList, isLoading: listLoading, error: listError } = usePokemonList(MAX_POKEMON);

    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailsError, setDetailError] = useState(null);

    const paginatedUrls = useDeepMemo(() => {
        if (!pokemonList?.results) return [];

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, MAX_POKEMON);

        return pokemonList.results.slice(startIndex, endIndex).map(p => p.url);
    }, [pokemonList, page, itemsPerPage]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (paginatedUrls.length === 0) return;

            setIsLoadingDetails(true);
            setDetailError(null);

            try {
                const results = await Promise.all(
                    paginatedUrls.map(url => 
                        fetcher(url).catch(err => {
                            console.error(`Failed to fetch ${url}`, err);
                            return null;
                        })
                    )
                );

                 const validResults = results.filter(Boolean).map(details => ({
                    id: details.id,
                    name: details.name,
                    image: details.sprites?.front_default || details.sprites?.other?.['official-artwork']?.front_default,
                    types: details.types.map(t => t.type.name),
                    stats: details.stats.map(s => ({
                        name: s.stat.name,
                        value: s.base_stat
                    })),
                    height: details.height,
                    weight: details.weight,
                    abilities: details.abilities.map(a => a.ability.name)
                }));

                setPokemonDetails(validResults);
            } catch (error) {
                setDetailError(error.message || 'Failed to fetch Pokemon details');
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchDetails()
    }, [paginatedUrls]);

    const totalPages = Math.ceil((pokemonList?.results?.length || 0) / itemsPerPage);

    const sortedPokemonDetails = useDeepMemo(() => {
        if (!pokemonDetails.length) return [];

        return [...pokemonDetails].sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'id') {
                comparison = a.id - b.id;
            } else if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [pokemonDetails, sortBy, sortOrder]);

    const filteredPokemonDetails = useDeepMemo(() => {
        if (!sortedPokemonDetails.length) return [];
        if (!typeFilter.length) return sortedPokemonDetails;

        return sortedPokemonDetails.filter(pokemon => 
            typeFilter.every(type => pokemon.types.includes(type))
        );
    }, [sortedPokemonDetails, typeFilter]);

    return {
        paginatedData: filteredPokemonDetails,
        loading: listLoading || isLoadingDetails,
        error: listError || detailsError,
        page,
        totalPages,
        setPage,
        hasMore: (page * itemsPerPage) < (pokemonList?.results?.length || 0)
    };
};