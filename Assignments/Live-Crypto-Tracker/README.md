# Crypto Tracker

A simple React app demonstrating real-time price and volume fluctuations for five selected cryptocurrencies, with live data from Binance and a fallback mock service.

## Project Structure

```
.
└── src/
    ├── assets/
    ├── components/
    │   ├── CryptoFilters.jsx
    │   ├── CryptoTable.jsx
    │   └── CryptoTableRow.jsx
    ├── features/crypto/
    │   ├── cryptoSlice.js
    │   └── initialData.js
    ├── services/
    │   ├── binanceWebSocket.js
    │   └── mockWebSocket.js
    ├── App.css
    ├── App.jsx
    └── main.jsx
```

## 🚀 Setup Instructions

```bash
# Clone repo
git clone <repo-url>
cd Live-Crypto-Tracker

# Install dependencies
npm install

# Start dev server
npm run dev

```

_No environment variables required (mock service only)._ 

## 🛠 Tech Stack & Architecture

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit + React-Redux
- **WebSocket Services**:
  - **BinanceWebSocketService**: streams live data for 5 assets
  - **MockWebSocketService**: simulates updates when real WebSocket fails
- **LocalStorage**:
  - Favorites and filter selections are stored persistently
- **Components**:
  - **Header**: title, data-source toggle button, connection status indicator
  - **CryptoFilters**: name search, price range, gainers/losers filter
  - **CryptoTable**: sortable table of assets with sparklines and favorite toggles

**Flow**:
1. App initializes Redux store
2. Attempts Binance connection; on error, switches to mock (console logs available)
3. UI button allows manual toggle between real and mock data
4. User-selected favorites and filters persist across sessions via localStorage

## 🎬 Demo

Video link: [Watch Demo](https://www.loom.com/share/1aac39fc424248a4b8ccf4013592fcc9?sid=c4b049f7-42aa-4643-a14d-b9fb4e2e4a9c)