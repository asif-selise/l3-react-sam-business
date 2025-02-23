import { screen, waitFor } from '@testing-library/react';
import ApartmentDetailsTable from './ApartmentDetailsTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('ApartmentDetailsTable', () => {
  const mockApartmentList = [
    {
      ApartmentNoCustomer: 101,
      OwnerId: 1,
      Remarks: 'Some remarks',
      LastTenant: 'John Doe',
      ManagementAppartment: 201,
      ManagerName: 'Manager Name',
      ManagementName: 'Management Name',
      OwnerName: 'Owner Name',
      ManagementLevel: 1,
      OwnerLevel: 'Level 2',
      OwnerLastName: 'Doe',
      LastChangedDate: '2024-01-01',
      ObjectId: 67890,
    },
  ];

  const mockGetFilteredDataList = jest.fn();

  beforeEach(() => {
    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [],
      getDataList: jest.fn(),
      isLoading: false,
      dataItem: null,
      getDataItem: jest.fn(),
      filteredDataList: mockApartmentList,
      getFilteredDataList: mockGetFilteredDataList,
      updateDataLists: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockApartmentList,
      isLoading: false,
      onEdit: jest.fn(),
      onSelect: jest.fn(),
    };

    return renderRootProvider(<ApartmentDetailsTable {...defaultProps} {...props} />);
  };

  test('renders table rows properly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByText('Some remarks')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
