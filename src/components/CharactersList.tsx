import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Character } from '../types/characters';
import { useDebounce } from '../common/hooks/useDebounce';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('https://swapi.dev/api/people');
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.log('Error fetching characters:', error);
    }
  };

  useEffect(() => {
    fetchCharacters();
  },        []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCharacters = useMemo(() => characters.filter((character) =>
    character.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  ),                                 [characters, debouncedSearchQuery]);

  return (
    <div>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <ul>
        {filteredCharacters.map((character) => (
          <li key={character.name}>
            <Link to={`/character/${character.name}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharactersList;
