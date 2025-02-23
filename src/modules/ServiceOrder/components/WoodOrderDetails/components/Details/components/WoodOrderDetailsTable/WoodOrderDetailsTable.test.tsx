import { screen } from '@testing-library/react';
import WoodOrderDetailsTable from './WoodOrderDetailsTable';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => {
  return jest.fn().mockReturnValue({
    filteredDataList: [],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  });
});

describe('WoodOrderDetailsTable component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      selectedWoodOrderID: 1,
      selectedWoodOrderDetails: undefined,
      setSelectedWoodOrderDetails: jest.fn(),
      completionStatus: false,
    };

    return renderRootProvider(<WoodOrderDetailsTable {...defaultProps} {...props} />);
  };
  test('renders table rows properly when data is provided', () => {
    renderComponent();

    expect(screen.getByText('WOOD_ORDER_ID')).toBeInTheDocument();
    expect(screen.getByText('QTY')).toBeInTheDocument();
    expect(screen.getByText('DESIGNATION')).toBeInTheDocument();
  });

  test('renders no data available message when data is empty', () => {
    renderComponent();

    expect(screen.getByText('NO_DATA_AVAILABLE')).toBeInTheDocument();
  });
});
