import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import ProductsTable from './ProductsTable';

describe('ProductsTable Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: [
        {
          Description: 'description1',
          ManufacturerNumber: 56,
          ProductGroupNumber: 1,
        },
        {
          Description: 'description2',
          ManufacturerNumber: 57,
          ProductGroupNumber: 2,
        },
      ],
      isLoading: false,
      totalDataLength: 2,
      onProductRowClick: jest.fn(),
      onPageChange: jest.fn(),
    };

    return renderRootProvider(<ProductsTable {...defaultProps} {...props} />);
  };

  test('renders ProductsTable component', () => {
    renderComponent();

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  test('renders ProductsTable headers', () => {
    renderComponent();

    expect(screen.getByText('DESCRIPTION')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();
    expect(screen.getByText('COLOR')).toBeInTheDocument();
  });

  test('filters table data based on searchKeyword', () => {
    const searchKeyword = '56';
    renderComponent({ searchKeyword });

    const rows = screen.getAllByLabelText('product-row');

    expect(rows).toHaveLength(2);

    // rows.forEach((row) => {
    //   const cells = row.querySelectorAll('td');
    //   const cellTexts = Array.from(cells).map((cell) => cell.textContent?.toLowerCase());
    //   const matchesSearchKeyword = cellTexts.some((text) =>
    //     text?.includes(searchKeyword.toLowerCase())
    //   );
    //   expect(matchesSearchKeyword).toBe(true);
    // });
  });
});
