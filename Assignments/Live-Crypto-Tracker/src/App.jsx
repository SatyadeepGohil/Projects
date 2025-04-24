import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './features/crypto/cryptoSlice';
import CryptoTable from './components/CryptoTable';
import { MockWebSocketService } from './services/mockWebsocket';
import { BinanceWebSocketService } from './services/binanceWebSocket';
import './App.css';

const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
});

function App() {
  const [useMock, setUseMock] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let service;

    if (useMock) {
      service = new MockWebSocketService(store);
    } else {
      try {
        service = new BinanceWebSocketService(store);
      } catch (error) {
        console.error("Failed to intialize Binance WebSocket:", error);
        service = new MockWebSocketService(store);
        setUseMock(true);
      }
    }

    service.connect();
    setIsConnected(true);

    return () => {
      service.disconnect();
      setIsConnected(false);
    };
  }, [useMock]);

  const toggleDataSource = () => {
    setIsConnected(false);
    setUseMock(!useMock);
  };

  return (
    <Provider store={store}>
      <div className='App'>
        <header className='App-header'>
          <h1>Crypto Tracker</h1>
          <div className='data-source-toggle'>
            <button onClick={toggleDataSource}>
              Using {useMock ? 'Mock' : 'Binance'} Data
            </button>
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </header>
        <main className='App-main'>
          <CryptoTable />
        </main>
        <footer className={'App-footer'}>
          <p>Data updates from {useMock ? 'simulated every 1-2 seconds' : 'Binance Websocket'}</p>
        </footer>
      </div>
    </Provider>
  )
}

export default App;