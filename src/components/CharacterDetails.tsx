import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { charactersStore } from '../stores/CharactersStore';

export const CharacterDetails: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { characters, updateCharacter } = charactersStore;

  const character = characters.get(id!)!;

  const handleBirthYearChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateCharacter(character.name, { birth_year: event.target.value });
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCharacter(character.name, { gender: event.target.value });
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCharacter(character.name, { height: event.target.value });
  };

  return (
    <div>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ m: 2 }}>
                {character.name}
              </Typography>
              <TextField
                sx={{ m: 2 }}
                label="Birth Year"
                value={character.birth_year}
                onChange={handleBirthYearChange}
              />
              <TextField
                sx={{ m: 2 }}
                label="Gender"
                value={character.gender}
                onChange={handleGenderChange}
              />
              <TextField
                sx={{ m: 2 }}
                label="Height"
                value={character.height}
                onChange={handleHeightChange}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
});

CharacterDetails.displayName = 'CharacterDetails';
