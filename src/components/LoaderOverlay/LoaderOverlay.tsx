import { Box, CircularProgress, type CircularProgressProps, Typography } from '@mui/material';
import { JSX } from 'react';

interface Props {
  type?: 'full-page' | 'container';
  title?: string;
  progress?: number;
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const LoaderOverlay = ({ progress, title, type = 'full-page' }: Props): JSX.Element => {
  return (
    <Box
      aria-label="loader-overlay"
      sx={{
        position: type === 'full-page' ? 'fixed' : 'absolute',
        width: type === 'full-page' ? '100vw' : '100%',
        height: type === 'full-page' ? '100vh' : '100%',
        backgroundColor: 'rgba(227, 227, 232, 0.8)',
        left: 0,
        zIndex: 100,
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {progress != null ? <CircularProgressWithLabel value={progress} /> : <CircularProgress />}

      {title && (
        <Typography
          sx={{
            mt: '8px',
            textAlign: 'center',
            display: 'block',
            color: '#0056A4',
            textTransform: 'capitalize',
          }}
          variant="h6"
        >
          {title} Data
        </Typography>
      )}
    </Box>
  );
};

export default LoaderOverlay;
