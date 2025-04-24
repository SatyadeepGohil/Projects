import { updateCryptoData } from "../features/crypto/cryptoSlice";

export class MockWebSocketService {
    constructor(store) {
        this.store = store;
        this.interval = null;
    }

    connect() {
        this.interval = setInterval(() => {
            const state = this.store.getState();
            const assets = state.crypto.assets;

            const randomAsset = assets[Math.floor(Math.random() * assets.length)];

            const priceChangePercentage = (Math.random() * 4 - 2) / 100;
            const newPrice = randomAsset.price * (1 + priceChangePercentage);

            const volumeChange = (Math.random() * 0.1 - 0.05);
            const newVolume = randomAsset.volume_24h * (1 + volumeChange);

            const newChanges = {
                percent_change_1h: randomAsset.percent_change_1h + (Math.random() * 1 - 0.5),
                percent_change_24h: randomAsset.percent_change_24h + (Math.random() * 1 - 0.5),
                percent_change_7d: randomAsset.percent_change_7d + (Math.random() * 1 - 0.5),
            };

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
    }
}