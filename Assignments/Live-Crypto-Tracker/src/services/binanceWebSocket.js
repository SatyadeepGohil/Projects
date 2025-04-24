import { updateCryptoData } from "../features/crypto/cryptoSlice";

export class BinanceWebSocketService {
    constructor(store) {
        this.store = store;
        this.socket = null;
        this.reconnectInterval = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];
        this.symbolToId = {
            'BTCUSDT': 1,
            'ETHUSDT': 2,
            'BNBUSDT': 3,
            'SOLUSDT': 4,
            'ADAUSDT': 5,
        };

        this.lastUpdateTime = {};
    }

    connect () {
        try {

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.log(`Max reconnection attempts (${this.maxReconnectAttempts}) reached, switching to mock data`);
                window.dispatchEvent(new CustomEvent('binanceConnectionError'));
                return;
            }

            const streams = this.symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
            const url = `wss://stream.binance.com:9443/ws/${streams}`;

            console.log(`Attempting to connect to Binance WebSocket (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts + 1}})`)
            this.socket = new WebSocket(url);

            const connectionTimeout = setTimeout(() => {
                if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
                    console.log('WebSocket connection timeout');
                    this.socket.close();
                    this.handleReconnect();
                }
            }, 10000) // 10 seconds timeout

            this.socket.onopen = () => {
                console.log('connected to Binance WebSocket');
                clearTimeout(connectionTimeout);
                this.reconnectAttempts = 0;
            }

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.processTickerUpdate(data);
            }

            this.socket.onerror = (error) => {
                console.error('Websocket Error:', error);
                clearTimeout(connectionTimeout);
                this.handleReconnect();
            }

            this.socket.onclose = (event) => {
                console.log('WebSocket connection closed');
                clearTimeout(connectionTimeout);
                this.handleReconnect();
            }
        } catch (error) {
            console.error('Failed to connect to Binance:', error);
            window.dispatchEvent(new CustomEvent('binanceConnectionError'));
        }
    }

    handleReconnect() {
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log(`Max reconnection attempts (${this.maxReconnectAttempts}) reached, switching to mock data`)
            window.dispatchEvent(new CustomEvent('binanceConnectionError'));
            return;
        }

        console.log(`Reconnecting in ${5 * this.reconnectAttempts} seconds`);

        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
        }

        this.reconnectInterval = setTimeout(() => {
            if (this.socket) {
                this.socket.close();
                this.socket = null;
            }

            this.connect();
        }, 5000 * this.reconnectAttempts); // Exponential backoff
    }

    processTickerUpdate(data) {
        if (!data || !data.s) return;

        const symbol = data.s;
        const id = this.symbolToId[symbol];

        if (!id) return;

        const now = Date.now();
        if (this.lastUpdateTime[symbol] && now - this.lastUpdateTime[symbol] < 1000) return;

        this.lastUpdateTime[symbol] = now;

        const updates = {
            price: parseFloat(data.c),
            percent_change_24h: parseFloat(data.P),
            percent_change_1h: parseFloat(data.p) / 24, // Aproximation of an hour
            volume_24h: parseFloat(data.v) * parseFloat(data.c),
            // can't get the 7d ticker
        };
        
        this.store.dispatch(updateCryptoData({ id, updates }));
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