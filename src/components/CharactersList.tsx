import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Character } from '../types/characters';
import { useDebounce } from '../common/hooks/useDebounce';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [listCompeleted, setListCompleted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadCharacters = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`https://swapi.dev/api/people?page=${page}`);
      const data = await response.json();
      if (!data.next) {
        setListCompleted(true);
      }

      setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);
    } catch (error) {
      console.log('Error loading characters:', error);
    }

    setIsLoading(false);
  },                                 [page]);

  useEffect(() => {
    loadCharacters();
  },        [loadCharacters]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (observerRef.current) {
      observerRef.current.observe(document.getElementById('observer')!);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
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
      <Grid container={true} spacing={2} justifyContent={'center'}>
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
        {!listCompeleted && <div id="observer" />}
        {isLoading && <CircularProgress sx={{ m: 1 }} />}          
      </Grid>
    </div>
  );
}

export default CharactersList;
