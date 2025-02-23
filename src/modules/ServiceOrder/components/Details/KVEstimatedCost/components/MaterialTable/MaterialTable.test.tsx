import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import MaterialTable from './MaterialTable';

describe('MaterialTable', () => {
  const mockedTableData = [
    {
      id: 1,
      ProductId: 'ProductId1',
      ArticleNumber: 'ArticleNumber1',
      Description: 'Description1',
      UnitPrice: 'UnitPrice1',
      TotalCost: 'TotalCost1',
      CreatedAt: '2022-01-01T00:00:00.000Z',
      UpdatedAt: '2022-01-01T00:00:00.000Z',
      ChangedBy: 'ChangedBy1',
    },
    {
      id: 2,
      ProductId: 'ProductId2',
      ArticleNumber: 'ArticleNumber2',
      Description: 'Description2',
      UnitPrice: 'UnitPrice2',
      TotalCost: 'TotalCost2',
      CreatedAt: '2022-01-01T00:00:00.000Z',
      UpdatedAt: '2022-01-01T00:00:00.000Z',
      ChangedBy: 'ChangedBy2',
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
      onReplaceMaterial: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      readOnly: false,
      setReadOnly: jest.fn(),
    };

    return renderRootProvider(<MaterialTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('PRODUCT_ID')).toBeInTheDocument();
    expect(screen.getByText('ARTICLE_NO')).toBeInTheDocument();
    expect(screen.getByText('DESIGNATION')).toBeInTheDocument();
    expect(screen.getByText('KV_OPERATION')).toBeInTheDocument();
  });
});
