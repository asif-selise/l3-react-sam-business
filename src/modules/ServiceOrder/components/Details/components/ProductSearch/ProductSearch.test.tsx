import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ProductSearch from './ProductSearch';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    dataList: [],
    getDataList: jest.fn(),
    isLoading: false,
  })
);

jest.mock('@/src/hooks/useGetPaginatedProducts/useGetPaginatedProducts.hook', () =>
  jest.fn().mockReturnValue({
    data: {
      message: 'Mocked message',
      success: true,
      data: [],
    },
    isError: false,
    isLoading: false,
    refetch: jest.fn(),
  })
);

jest.mock('./components/ProductsTable/ProductsTable', () => {
  const ProductsTable = () => <div>ProductsTable</div>;
  return ProductsTable;
});

Object.assign(navigator, {
  clipboard: {
    readText: jest.fn(),
  },
});

describe('ProductSearch Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onProductRowClick: jest.fn(),
      type: 'article' as any,
    };

    return renderRootProvider(<ProductSearch {...defaultProps} {...props} />);
  };

  test('renders ProductSearch component', () => {
    renderComponent();

    const modal = screen.getByLabelText('product-search');
    expect(modal).toBeInTheDocument();
  });

  test('renders SearchBar component', () => {
    renderComponent();

    const searchBar = screen.getByPlaceholderText('SEARCH_BY_KEYWORD');
    expect(searchBar).toBeInTheDocument();
  });

  test('handles Insert from clipboard', async () => {
    const mockClipboardText = 'mock clipboard text';
    jest.spyOn(navigator.clipboard, 'readText').mockResolvedValue(mockClipboardText);

    renderComponent();

    const insertButton = screen.getByRole('button', { name: 'INSERT_FROM_CLIPBOARD' });
    await user.click(insertButton);

    waitFor(() => {
      expect(screen.getByDisplayValue(mockClipboardText)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('SEARCH_BY_KEYWORD')).toHaveValue(mockClipboardText);
    });
  });
});
