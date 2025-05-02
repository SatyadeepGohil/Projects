import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { FavouriteProvider } from './context/FavoriteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavouriteProvider>
      <App />
    </FavouriteProvider>
  </StrictMode>,
)
