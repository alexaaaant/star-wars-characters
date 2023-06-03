import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import {
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useDebounce } from '../common/hooks/useDebounce';
import { observer } from 'mobx-react-lite';
import { charactersStore } from '../stores/CharactersStore';
import { CharacterCard } from './CharacterCard';

export const CharactersList = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);
  const observerComp = useRef<IntersectionObserver | null>(null);
  const initial = useRef(true);
  const { characters, startSearch, loadNextPage, isLoading } =
    charactersStore;

  useEffect(() => {
    if (initial.current && characters.size) {
      return;
    }
    initial.current = false;
    startSearch(debouncedSearchQuery);
  },        [debouncedSearchQuery, startSearch]);

  const observerRef = useCallback(
    (node: HTMLDivElement) => {
      if (!observerComp.current) {
        observerComp.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loadNextPage();
          }
        });
      }

      if (node !== null) {
        observerComp.current.observe(node);
      } else {
        observerComp.current.disconnect();
      }
    },
    [loadNextPage]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const charactersElements = () => {
    const elements: ReactNode[] = [];
    let i = 0;
    characters.forEach((character) => {
      elements.push(
        <CharacterCard
          key={character.name}
          character={character}
          observerRef={i === characters.size - 1 ? observerRef : null}
        />
      );
      i++;
    });
    return elements;
  };

  return (
    <Container>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ m: 2 }}
      />
      {!!characters.size && (
        <Grid container={true} spacing={2}>
          {charactersElements()}
        </Grid>
      )}
      <Grid container={true} justifyContent={'center'}>
        {!characters.size && !isLoading && (
          <Typography variant="h5" component="h2">
            Empty
          </Typography>
        )}
        {isLoading && <CircularProgress sx={{ m: 2 }} />}
      </Grid>
    </Container>
  );
});

CharactersList.displayName = 'CharactersList';
