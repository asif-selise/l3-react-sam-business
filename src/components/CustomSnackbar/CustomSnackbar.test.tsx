import { screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import CustomSnackbar from './CustomSnackbar';

describe('Snackbar test suite', () => {
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
  });

  test('should render the success Snakebar', async () => {
    renderRootProvider(<CustomSnackbar />, { store });
    expect(screen.getByText(/Success snackbar/)).toBeInTheDocument();
    expect(screen.getByText(/Error snackbar/)).toBeInTheDocument();
    expect(await screen.findAllByLabelText('Close')).toBeDefined();
  });
});
