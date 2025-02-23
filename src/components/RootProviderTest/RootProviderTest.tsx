import { store as defaultStore } from '@/src/redux/store';
import { type Store } from '@reduxjs/toolkit';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { queryClientConfig } from '../TanstackProvider/TanstackProvider';

interface RootProviderProp {
  store?: Store;
  client?: QueryClient;
  children: ReactNode;
}

interface Options {
  options?: RenderOptions;
  store?: Store;
  client?: QueryClient;
}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string): string => key,
    i18n: {
      changeLanguage: async () => await new Promise(() => {}),
      language: 'en',
    },
  }),
}));

export const RootProvider = ({
  store = defaultStore,
  client = queryClientConfig(),
  children,
}: RootProviderProp): React.JSX.Element => (
  <Provider store={store}>
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  </Provider>
);

export const renderRootProvider = (
  ui: ReactElement,
  { store, client, ...options }: Options = {}
): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <RootProvider store={store} client={client}>
      {children}
    </RootProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};
