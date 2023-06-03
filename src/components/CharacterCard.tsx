import { Card, CardContent, Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../types/characters';

interface CharacterCardProps {
  character: Character;
  observerRef: ((el: HTMLDivElement) => void) | null;
}

export const CharacterCard: React.FC<CharacterCardProps> = observer(
  ({ character, observerRef }) => {

    return (
      <>
        {character ? (
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
            {observerRef && <div ref={observerRef} />}
          </Grid>
        ) : (
          ''
        )}
      </>
    );
  }
);

CharacterCard.displayName = 'CharacterCard';
