import { screen, fireEvent, waitFor } from '@testing-library/react';
import WoodOrder from './WoodOrder';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => jest.fn());

jest.mock('./components/WoodOrderTable/WoodOrderTable', () =>
  jest.fn(() => <div>WoodOrderTable Component</div>)
);

jest.mock('./components/UpsertWoodItem/UpsertWoodItem', () =>
  jest.fn(() => <div>UpsertWoodItem Component</div>)
);

describe('WoodOrder', () => {
  const mockUpdateWoodOrderList = jest.fn();
  const mockGetWoodOrderList = jest.fn().mockResolvedValue([]);

  beforeEach(() => {
    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: mockGetWoodOrderList,
      updateDataLists: mockUpdateWoodOrderList,
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });
  });
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
    serviceOrder: {
      id: 1,
    },
    soStatus: {
      soStatus: 'ReadOnly',
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      selectedWoodOrderID: 1,
      samOfferUId: '1',
      samOfferId: 1,
      setSelectedWoodOrderID: jest.fn(),
      setSelectedWoodOrderDetails: jest.fn(),
      completionStatus: false,
      showSamOfferWoodOrders: false,
    };

    return renderRootProvider(<WoodOrder {...defaultProps} {...props} />, { store });
  };

  test('renders WoodOrder component properly', () => {
    renderComponent();

    expect(screen.getByText('WoodOrderTable Component')).toBeInTheDocument();
    expect(screen.getByText('ADD_NEW_ITEM')).toBeInTheDocument();
  });

  test('opens and closes the UpsertWoodItem modal', () => {
    renderComponent();

    const addButton = screen.getByText('ADD_NEW_ITEM');
    fireEvent.click(addButton);

    waitFor(() => {
      expect(screen.getByText('UpsertWoodItem Component')).toBeInTheDocument();
    });
  });
});
