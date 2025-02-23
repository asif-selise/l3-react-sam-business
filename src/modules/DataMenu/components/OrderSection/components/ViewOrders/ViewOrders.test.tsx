import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ViewOrders from './ViewOrders';

jest.mock('idb-keyval');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockOnClose = jest.fn();

describe('View Orders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display ViewOrders component initially', () => {
    renderRootProvider(<ViewOrders onClose={mockOnClose} />);

    expect(screen.getByText('BOOK_ORDERS_GOOD_RECEIPTS')).toBeInTheDocument();
  });
});
