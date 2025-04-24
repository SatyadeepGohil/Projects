import { createSlice } from '@reduxjs/toolkit';
import { initialCryptoData } from './initialData';

export const cryptoSlice = createSlice({
    name: 'crypto',
    initialState: {
        assets: initialCryptoData,
    },
    reducers: {
        updateCryptoData: (state, action) => {
            const { id, updates } = action.payload;
            const assetIndex = state.assets.findIndex(asset => asset.id === id);
            if (assetIndex !== -1) {
                state.assets[assetIndex] = { ...state.assets[assetIndex], ...updates };
            }
        }
    }
});

export const { updateCryptoData } = cryptoSlice.actions;

export const selectAllAssets = state => state.crypto.assets;
export const selectAssetById = (state, id) => 
    state.crypto.assets.find(asset => asset.id === id);

export default cryptoSlice.reducer;