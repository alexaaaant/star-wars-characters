import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';
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
      <Grid container={true} spacing={2}>
        {filteredCharacters.map((character) => (
          <Grid item={true} xs={12} sm={6} md={4} key={character.name}>
            <Link to={`/character/${character.name}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {character.name}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CharactersList;
