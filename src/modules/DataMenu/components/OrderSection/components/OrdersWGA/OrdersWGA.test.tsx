import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import OrdersWGA from './OrdersWGA';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('idb-keyval');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockOnClose = jest.fn();

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

jest.mock('./components/OrdersWGATable/OrdersWGATable', () => {
  const OrdersWGATable = () => (
    <div>
      ORDERS_WGA
      <button onClick={() => {}}>ADD_NEW</button>
    </div>
  );
  return OrdersWGATable;
});

describe('OrdersWGA Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display OrdersWGATable initially', () => {
    renderRootProvider(<OrdersWGA onClose={mockOnClose} />, { store });

    expect(screen.getByRole('heading', { name: 'ORDERS_WGA' })).toBeInTheDocument();
  });

  test('should close modal when discard is clicked', () => {
    renderRootProvider(<OrdersWGA onClose={mockOnClose} />, { store });
    fireEvent.click(screen.getByText('DISCARD'));

    expect(mockOnClose).toHaveBeenCalledWith(false);
  });
});
