import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PokemonDetail from './components/PokemonDetail';
import FavoritesPage from './FavoritesPage';
import ComparePokemon from './ComaparisonPage';
import './styles/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/pokemon/:pokemonId' element={<PokemonDetail />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/compare' element={<ComparePokemon />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;