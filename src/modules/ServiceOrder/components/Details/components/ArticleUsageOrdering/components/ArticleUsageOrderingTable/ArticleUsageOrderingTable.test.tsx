import ArticleUsageOrderingTable from './ArticleUsageOrderingTable';
import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    filteredDataList: [],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  })
);

describe('ArticleUsageOrderingTable', () => {
  const mockedTableHeads = [
    {
      id: 'articleNo',
      label: 'Article No.',
      sortable: false,
    },
    {
      id: 'articleDescription',
      label: 'Article Description',
      sortable: false,
    },
  ];
  const mockedTableData = [
    {
      id: 1,
      articleNo: 'articleNo1',
      articleDescription: 'articleDescription1',
    },
    {
      id: 2,
      articleNo: 'articleNo2',
      articleDescription: 'articleDescription2',
    },
  ];
  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      headCells: mockedTableHeads,
      isLoading: false,
      onEditModalSubmit: jest.fn(),
      onCopyRow: jest.fn(),
      onDeletion: jest.fn(),
      showAllSourceStocks: false,
    };
    return renderRootProvider(<ArticleUsageOrderingTable {...defaultProps} {...props} />);
  };
  it('should render the table', () => {
    renderComponent();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
  it('should render the table headers', () => {
    renderComponent();
    expect(screen.getByText('Article No.')).toBeInTheDocument();
    expect(screen.getByText('Article Description')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByText('articleNo1')).toBeInTheDocument();
      expect(screen.getByText('articleDescription1')).toBeInTheDocument();
      expect(screen.getByText('articleNo2')).toBeInTheDocument();
      expect(screen.getByText('articleDescription2')).toBeInTheDocument();
    });
  });
});
