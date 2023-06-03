import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../types/characters';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);

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

  return (
    <div>
      <ul>
        {characters.map((character) => (
          <li key={character.name}>
            <Link to={`/character/${character.name}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharactersList;
