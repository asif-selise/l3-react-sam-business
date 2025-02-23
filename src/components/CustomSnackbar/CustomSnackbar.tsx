import { useDispatch, useSelector } from '@/src/redux/store';
import { Box, Grid, IconButton, Snackbar, SnackbarContent, Typography } from '@mui/material';
import { hideSnackbar } from '@/src/slices/snackbarSlice/snackbar.slice';
import Iconify from '../iconify/iconify';
import { JSX } from 'react';

const CustomSnackbar = (): JSX.Element => {
  const { snackbarQueue } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = (reason: string, key: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideSnackbar(key));
  };

  const getSnackbarColor = (item: string) => {
    if (item === 'success') return 'success.main';
    else if (item === 'error') return 'error.light';
    else return 'warning.main';
  };

  return (
    <>
      {snackbarQueue?.map((item, index) => (
        <Snackbar
          key={item.key}
          aria-label="snackbar"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={item.isVisible}
          autoHideDuration={8000}
          onClose={(_, reason) => {
            handleClose(reason, item.key);
          }}
          sx={{
            width: 'fit-content',
            maxWidth: '50vw',
            mx: 'auto',
            transform: `translate(0, ${index * 60}px) !important`,
          }}
        >
          <SnackbarContent
            sx={{
              backgroundColor: getSnackbarColor(item.type),
              color: '#fff',
              justifyContent: 'space-between',
              flexWrap: 'noWrap',
            }}
            message={
              <Grid container direction="row" alignItems="center" sx={{ flexWrap: 'noWrap' }}>
                <Box
                  sx={{
                    fontSize: '20px',
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.type === 'success' ? (
                    <Iconify
                      icon={'material-symbols:check-circle'}
                      sx={{ width: '24px', height: '24px', color: '#fff' }}
                    />
                  ) : (
                    <Iconify
                      icon={'material-symbols:error'}
                      sx={{ width: '24px', height: '24px', color: '#fff' }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    mt: '3px',
                    color: '#fff',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.title}
                </Typography>
              </Grid>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                sx={{
                  height: '40px',
                  width: '40px',
                  p: 1,
                  color: item.type === 'success' ? 'success.dark' : 'error.dark',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  },
                }}
                onClick={() => {
                  handleClose('cancelIconClicked', item.key);
                }}
                size="large"
              >
                <Iconify
                  icon={'material-symbols:close'}
                  sx={{ width: '20px', height: '20px', color: '#fff' }}
                />
              </IconButton>,
            ]}
          />
        </Snackbar>
      ))}
    </>
  );
};

export default CustomSnackbar;
