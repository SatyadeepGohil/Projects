import { useState } from "react";

export const useRandomPokemon = (max = 150) => {
    const [randomId, setRandomId] = useState(null);

    const generateRandom = () => {
        const newId = Math.floor(Math.random() * max) + 1;
        setRandomId(newId);
        return newId;
    }
    
    return {
        randomId,
        generateRandom
    }
}