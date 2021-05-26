import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

interface LoadingProps {
  message?: string;
}

export default function Loading(props: LoadingProps): JSX.Element {
  const { message = 'Loading...' } = props;

  return (
    <section>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
      >
        <Box margin={2}>
          <CircularProgress />
        </Box>
        {message ? <Typography>{message}</Typography> : null}
      </Box>
    </section>
  );
}
