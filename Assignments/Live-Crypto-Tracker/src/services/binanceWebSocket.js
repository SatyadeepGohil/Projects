import { updateCryptoData } from "../features/crypto/cryptoSlice";

export class BinanceWebSocketService {
    constructor(store) {
        this.store = store;
        this.socket = null;
        this.reconnectInterval = null;
        this.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];
        this.symbolToId = {
            'BTCUSDT': 1,
            'ETHUSDT': 2,
            'BNBUSDT': 3,
            'SOLUSDT': 4,
            'ADAUSDT': 5,
        };
    }

    connect () {
        try {
            const streams = this.symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
            const url = `wss://stream.binance.com:9443/ws/${streams}`;

            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log('connected to Binance WebSocket');
            }

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.processTickerUpdate(data);
            }

            this.socket.onerror = (error) => {
                console.error('Websocket Error:', error);
                this.fallbackToMock();
            }

            this.socket.onclose = () => {
                console.log('WebSocket connection closed');

                this.reconnectInterval = setTimeout(() => {
                    this.connect();
                }, 30000);
            }
        } catch (error) {
            console.error('Failed to connect to Binance:', error);
        }
    }

    processTickerUpdate(data) {
        if (!data || !data.s) return;

        const symbol = data.s;
        const id = this.symbolToId[symbol];

        if (!id) return;

        const updates = {
            price: parseFloat(data.c),
            percent_change_24h: parseFloat(data.P),
            percent_change_1h: parseFloat(data.p) / 24, // Aproximation of an hour
            volume_24h: parseFloat(data.v) * parseFloat(data.c),
            // can't get the 7d ticker
        };
        
        this.store.dispatch(updateCryptoData({ id, updates }));
    }

    fallbackToMock() {
        console.log('Falling back to mock Websocket service');
        this.disconnect();

        const { MockWebSocketService } = require('./mockWebsocket');
        const mockService = new MockWebSocketService(this.store);
        mockService.connect();
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }
}