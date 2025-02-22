import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../redux/store';
import { updateCount } from '@/src/slices/count.slice';
import { ThemeProvider } from '@emotion/react';
import useCustomTheme from '@/src/hooks/useCustomTheme/useCustomTheme';
import { Box, Button, Typography } from '@mui/material';

const Root = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useCustomTheme();
  const { amount } = useSelector((state) => state.count);

  const handleClick = () => {
    dispatch(updateCount({ amount: 6 }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography variant="body2">{t('WELCOME')}</Typography>
        <Typography variant="subtitle2">{amount}</Typography>
        <Button onClick={handleClick} variant="contained" color="primary">
          Increase
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Root;
