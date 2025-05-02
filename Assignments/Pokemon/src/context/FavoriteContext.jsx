import React, { useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FavouriteContext = React.createContext();

export const FavouriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useLocalStorage('pokemon-favorites', []);

    const toggleFavorite = (pokemonId) => {
        setFavorites(prev => {
            if (prev.includes(pokemonId)) {
                return prev.filter(id => id !== pokemonId);
            } else {
                return [...prev, pokemonId];
            }
        });
    };

    const value = {
        favorites,
        toggleFavorite,
        isFavorite: (id) => favorites.includes(id)
    };

    return (
        <FavouriteContext.Provider value={value}>
         {children}
       </FavouriteContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavouriteContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}