import Details from './Details';
import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    filteredDataList: [
      {
        WoodOrderDetailId: 1,
        WoodOrderId: 123,
        Quantity: 10,
        Description: 'Sample Wood',
        DMassD: 12.5,
        DMassH: 10.0,
        DMassL: 8.0,
        EdgeDetailEdgeColor: 'Red',
        EdgeDetailSurfaceColor: 'Glossy',
        OrderAssemblyDescription: 'Description of Order Assembly',
        UserCreatedBy: 'User1',
        OrderAssemblyCreatedDate: '2024-08-01',
        UserModifiedBy: 'User2',
        OrderAssemblyModifiedDate: '2024-08-10',
      },
    ],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  })
);

describe('Details component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      selectedWoodOrderID: 97,
      selectedWoodOrderDetails: undefined,
      setSelectedWoodOrderDetails: jest.fn(),
      completionStatus: false,
    };

    return renderRootProvider(<Details {...defaultProps} {...props} />);
  };

  test('renders properly and displays data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Wood Order Details Table')).toBeInTheDocument();
      expect(screen.getByText('Sample Wood')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
    });
  });
});
