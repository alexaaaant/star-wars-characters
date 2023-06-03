import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Character } from '../types/characters';
import { useDebounce } from '../common/hooks/useDebounce';
import { usePrev } from '../common/hooks/usePrev';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);
  const prevSearchQuery = usePrev(debouncedSearchQuery);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const listCompeleted = useRef(false);
  const [reqParams, setReqParams] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  const loadCharacters = useCallback(async () => {
    if (!reqParams) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`https://swapi.dev/api/people?${reqParams}`);
      const data = await response.json();
      if (!data.next) {
        listCompeleted.current = true;
      }
      if (data.results) {
        setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);
      }
    } catch (error) {
      console.log('Error loading characters:', error);
    }

    setIsLoading(false);
  },                                 [reqParams]);

  useEffect(() => {
    if (debouncedSearchQuery !== prevSearchQuery) {
      listCompeleted.current = false;

      setCharacters([]);
      setPage(1);
      return;
    }
    setReqParams(`page=${page}&search=${debouncedSearchQuery}`);
  },        [debouncedSearchQuery, prevSearchQuery, page]);

  useEffect(() => {
    loadCharacters();
  },        [loadCharacters]);

  const observerRef = useCallback((node: HTMLDivElement) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !listCompeleted.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    }

    if (node !== null) {
      observer.current.observe(node);
    } else {
      observer.current.disconnect();
    }
  },                              []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ m: 2 }}
      />
      {!!characters.length && <Grid container={true} spacing={2}>
        {characters.map((character, index) => (
          <Grid item={true} xs={12} sm={6} md={4} key={character.name}>
            <Link
              to={`/character/${character.name}`}
              style={{ textDecoration: 'none' }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {character.name}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
            {index === characters.length - 1 && <div ref={observerRef} />}
          </Grid>
        ))}
      </Grid>}
      <Grid container={true} justifyContent={'center'}>
        {!characters.length && !isLoading && (
          <Typography variant="h5" component="h2">
            Empty
          </Typography>
        )}
        {isLoading && <CircularProgress sx={{ m: 2 }} />}
      </Grid>
    </Container>
  );
}

export default CharactersList;
