import { useState } from "react"

export const useLocalStorage = (key, initialvalue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialvalue;
        } catch (error) {
            console.error(error);
            return initialvalue;
        }
    });

    const setValue = value => {
        try {
            const valueToStorage = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStorage);
            window.localStorage.setItem(key, JSON.stringify(valueToStorage));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}