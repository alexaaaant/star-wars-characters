import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { CharacterDetails } from '../components/CharacterDetails';
import { CharactersList } from '../components/CharactersList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharactersList />} />
        <Route path="/character/:id" element={<CharacterDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;