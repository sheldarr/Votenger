import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';

import useGames from '../../../../hooks/useGames';
import usePoll from '../../../../hooks/usePoll';
import useUser from '../../../../hooks/useUser';

import { URL as POLL_URL } from '..';
import Page from '../../../../components/Page';

export const URL = (pollId: string) => `/polls/${pollId}/vote`;

const VoteFab = styled(Fab)`
  position: fixed !important;
  bottom: 2rem;
  right: 2rem;
`;

const MAX_VOTES = 4;

const PollVotePage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  const { data: poll } = usePoll(router.query.id as string);
  const { data: games } = useGames();

  const [votedFor, setVotedFor] = useState<string[]>([]);

  const votesLeft = MAX_VOTES - votedFor.length;

  const addVote = (vote: string) => {
    setVotedFor([...votedFor, vote]);
  };

  const removeVote = (vote: string) => {
    setVotedFor(
      votedFor.filter((voted) => {
        return voted !== vote;
      }),
    );
  };

  return (
    <Page title={`Vote ${poll?.name}`}>
      <Typography gutterBottom align="center" variant="h2">
        {poll?.name}
      </Typography>
      <Grid container spacing={1}>
        {games?.map((game) => (
          <Grid item key={game.name} lg={4} md={6} xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography gutterBottom component="h2" variant="h6">
                  {game.name}
                </Typography>
                <Typography color="textSecondary">{game.type}</Typography>
              </CardContent>
              <CardActions>
                {votedFor.includes(game.name) ? (
                  <Button
                    color="secondary"
                    onClick={() => {
                      removeVote(game.name);
                    }}
                  >
                    Unvote
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    disabled={votesLeft === 0}
                    onClick={() => {
                      addVote(game.name);
                    }}
                  >
                    Vote
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <VoteFab
        color="primary"
        disabled={votesLeft > 0}
        onClick={async () => {
          await axios.post(`/api/polls/${router.query.id}/vote`, {
            username: user?.username,
            votedFor,
          });

          router.replace(POLL_URL(router.query.id as string));
        }}
      >
        {votesLeft > 0 ? votesLeft : <CheckIcon />}
      </VoteFab>
    </Page>
  );
};

export default PollVotePage;
