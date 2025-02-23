import { ThemeProvider } from '@emotion/react';
import useCustomTheme from '@/src/hooks/useCustomTheme/useCustomTheme';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import tanStackConfig from '@/src/configs/tanstack.config';
import AppRouter from '../AppRouter/AppRouter';

const Root = () => {
  const theme = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={tanStackConfig}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Root;
