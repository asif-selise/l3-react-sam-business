import { CircularProgress, Grid } from '@mui/material';

const FullPageLoader = () => {
  return (
    <Grid sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <CircularProgress
        aria-label="Full page loader"
        sx={{
          position: 'absolute',
          color: 'primary.main',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Grid>
  );
};

export default FullPageLoader;
