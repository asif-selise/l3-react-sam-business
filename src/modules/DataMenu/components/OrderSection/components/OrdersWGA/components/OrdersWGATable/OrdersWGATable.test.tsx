import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrdersWGATable from './OrdersWGATable';
import configureMockStore from 'redux-mock-store';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { get } from 'idb-keyval';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('idb-keyval', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

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

describe('OrdersWGATable Component', () => {
  const mockSetCurrentView = jest.fn();

  const mockOrdersData = [
    {
      Id: 1,
      Product: 1,
      Quantity: 5,
      ArticleNumber: '12345',
      ProductText: 'Sample Product',
      IsSynchronizing: false,
    },
    {
      Id: 2,
      Quantity: 10,
      ArticleNumber: '67890',
      ProductText: 'Another Product',
      IsSynchronizing: true,
      Product: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (get as jest.Mock).mockResolvedValue(JSON.stringify(mockOrdersData));
  });

  test('renders OrdersWGATable and displays order data in table', async () => {
    renderRootProvider(<OrdersWGATable setCurrentView={mockSetCurrentView} />, { store });

    expect(screen.getByText('ADD_NEW')).toBeInTheDocument();

    expect(screen.getByText('NUMBER')).toBeInTheDocument();
    expect(screen.getByText('ARTICLE_NO')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT')).toBeInTheDocument();
  });
});
