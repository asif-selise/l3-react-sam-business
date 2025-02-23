import { useState } from 'react';
import useCustomTheme from '@/src/hooks/useCustomTheme/useCustomTheme';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

interface ThemeRegistryProps {
  options: { key: 'mui' };
  children: React.ReactNode;
}

export default function ThemeRegistry(props: ThemeRegistryProps) {
  const theme = useCustomTheme();
  const { options, children } = props;

  const [cache] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    return cache;
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
