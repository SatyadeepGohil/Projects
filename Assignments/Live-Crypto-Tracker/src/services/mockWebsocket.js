import { updateCryptoData } from "../features/crypto/cryptoSlice";

export class MockWebSocketService {
    constructor(store) {
        this.store = store;
        this.interval = null;
        this.updateCounter = 0;
    }

    connect() {
        console.log('Connected to mock Websocket service');

        this.interval = setInterval(() => {

            const state = this.store.getState();
            if (!state.crypto || !state.crypto.assets || state.crypto.assets.length === 0) return;

            this.updateCounter = (this.updateCounter + 1) % state.crypto.assets.length;
            const assetIndex = Math.floor(Math.random() * state.crypto.assets.length);
            const randomAsset = state.crypto.assets[assetIndex];

            if (!randomAsset) return;

            const priceChangePercentage = (Math.random() * 4 - 2) / 100; // -2% to - 2%
            const newPrice = randomAsset.price * (1 + priceChangePercentage);

            const volumeChange = (Math.random() * 0.1 - 0.05); // -5% to 5%
            const newVolume = randomAsset.volume_24h * (1 + volumeChange);

            const newChanges = {
                percent_change_1h: randomAsset.percent_change_1h + (Math.random() * 0.5 - 0.25),
                percent_change_24h: randomAsset.percent_change_24h + (Math.random() * 1 - 0.5),
                percent_change_7d: randomAsset.percent_change_7d + (Math.random() * 0.3 - 0.15),
            };

            if (Math.abs(newChanges.percent_change_1h > 15)) {
                newChanges.percent_change_1h = newChanges.percent_change_1h > 0 ? 15 : -15;
            }
            if (Math.abs(newChanges.percent_change_24h > 30)) {
                newChanges.percent_change_24h = newChanges.percent_change_24h > 0 ? 30 : -30;
            }
            if (Math.abs(newChanges.percent_change_7d > 50)) {
                newChanges.percent_change_7d = newChanges.percent_change_7d > 0 ? 50 : -50;
            }

            this.store.dispatch(updateCryptoData({
                id: randomAsset.id,
                updates: {
                    price: parseFloat(newPrice.toFixed(2)),
                    volume_24h: parseFloat(newVolume.toFixed(2)),
                    ...newChanges
                }
            }));
        }, 1000 + Math.random() * 1000);
    }

    disconnect() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log('Disconnected from mock WebSocket service');
    }
}