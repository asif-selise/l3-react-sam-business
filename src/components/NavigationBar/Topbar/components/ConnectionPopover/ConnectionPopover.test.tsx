import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ConnectionPopover from './ConnectionPopover';
import configureMockStore from 'redux-mock-store';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'index:SYNCHRONIZE') return 'SYNCHRONIZE';
      return key;
    },
  }),
}));

jest.mock('@azure/msal-react', () => {
  return {
    useMsal: jest.fn().mockReturnValue({
      instance: {},
    }),
  };
});

jest.mock('@/src/hooks/useSyncAPI/useSyncAPI', () => {
  return jest.fn().mockReturnValue({
    handleConnection: jest.fn(),
    uploadResponse: { isSuccess: true },
  });
});

jest.mock('@/src/hooks/useNetworkStatus/useNetworkStatus', () => {
  return jest.fn().mockReturnValue({
    checkOnlineStatus: jest.fn().mockReturnValue(true),
  });
});

jest.mock('@/src/hooks/useOrdersWGAData/useOrderWGAData', () => {
  return jest.fn().mockReturnValue({
    updateIsSynchronizingStatus: jest.fn(),
  });
});

describe('ConnectionPopover Component', () => {
  const renderComponent = () => {
    const store = configureMockStore()({
      snackbar: {
        snackbarQueue: [
          {
            key: 'snackbar_id_1',
            isVisible: true,
            type: 'success',
            title: 'Success snackbar',
          },
          {
            key: 'snackbar_id_2',
            isVisible: true,
            type: 'error',
            title: 'Error snackbar',
          },
        ],
      },
      sync: {
        sync: {
          status: 'initial',
          loading: false,
          selectedDate: new Date().toISOString().split('T')[0],
          autoSync: false,
          online: true,
        },
      },
    });

    return renderRootProvider(<ConnectionPopover />, { store });
  };
  test('displays reconnect button when not syncing and not connecting', () => {
    renderComponent();
    const reconnectButton = screen.getByRole('button', { name: 'index:SYNCHRONIZE' });
    expect(reconnectButton).toBeInTheDocument();
  });
  test('displays last sync time when syncing is complete', async () => {
    renderComponent();
    const reconnectButton = screen.getByRole('button', { name: 'index:SYNCHRONIZE' });
    await user.click(reconnectButton);
    // Wait for the circular progress to disappear
    await waitFor(
      () => {
        expect(screen.queryByTestId('ConnectionPopover_ConnectingLabel')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    ); // Adjust timeout as necessary
    const lastSyncTime = screen.getByTestId('ConnectionPopover_LastSyncTimeLabel');
    expect(lastSyncTime).toBeInTheDocument();
  }, 15000);
  // test('displays connecting text when connecting', async () => {
  //   renderComponent();
  //   const reconnectButton = screen.getByRole('button', { name: 'index:SYNCHRONIZE' });
  //   await user.click(reconnectButton);
  //   // Wait for the circular progress to disappear
  //   await waitFor(
  //     () => {
  //       expect(screen.queryByTestId('ConnectionPopover_ConnectingLabel')).toBeInTheDocument();
  //     },
  //     { timeout: 1000 }
  //   ); // Adjust timeout as necessary
  // });
  test('displays connection status image when not connecting', () => {
    renderComponent();
    const connectionStatusImage = screen.getByTestId('ConnectionPopover_ConnectionStatusImage');
    expect(connectionStatusImage).toBeInTheDocument();
  });
  // test('displays loading spinner when connecting', async () => {
  //   renderComponent();
  //   const reconnectButton = screen.getByRole('button', { name: 'index:SYNCHRONIZE' });
  //   await user.click(reconnectButton);
  //   await waitFor(
  //     () => {
  //       expect(
  //         screen.queryByTestId('ConnectionPopover_ConnectingCircularProgressBar')
  //       ).toBeInTheDocument();
  //     },
  //     { timeout: 10000 }
  //   );
  // }, 15000);
});
