import { screen, fireEvent } from '@testing-library/react';
import { type TableData } from '@/src/components/CustomTable/types';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import WoodOrderTable from './WoodOrderTable';
import configureMockStore from 'redux-mock-store';

const mockTableData: TableData[] = [
  {
    WoodOrderId: 1,
    SamOfferUId: 'test-uid-1',
    OrderId: 101,
    Remark: 'Test remark 1',
    CreatedOn: '2024-01-01',
    CreatedBy: 'User1',
    ChangedBy: 'Admin1',
    OrderedOn: '2024-01-02',
    OrderedBy: 'Client1',
    SamOfferId: 501,
    ColorDefinition: 'Blue',
    WoodOrderManufacturerId: 1001,
    CompletedOrDeactivated: true,
    TechnicianEmployeeNumber: 2001,
    ManufacturerKitchen: 'Kitchen1',
    PhotoManufacturerLabelMade: 'photo1.jpg',
  },
  {
    WoodOrderId: 2,
    SamOfferUId: 'test-uid-2',
    OrderId: 102,
    Remark: 'Test remark 2',
    CreatedOn: '2024-01-03',
    CreatedBy: 'User2',
    ChangedBy: 'Admin2',
    OrderedOn: '2024-01-04',
    OrderedBy: 'Client2',
    SamOfferId: 502,
    ColorDefinition: 'Red',
    WoodOrderManufacturerId: 1002,
    CompletedOrDeactivated: false,
    TechnicianEmployeeNumber: 2002,
    ManufacturerKitchen: 'Kitchen2',
    PhotoManufacturerLabelMade: 'photo2.jpg',
  },
];

jest.mock('@/src/components/ConfirmationModal/ConfirmationModal', () => ({
  __esModule: true,
  default: () => <div>Mocked ConfirmationModal</div>,
}));

jest.mock('../UpsertWoodItem/UpsertWoodItem', () => ({
  __esModule: true,
  default: () => <div>Mocked UpsertWoodItem</div>,
}));

jest.mock(
  '../../../Details/components/AddOrEditWoodOrderDetails/AddOrEditWoodOrderDetails',
  () => ({
    __esModule: true,
    default: () => <div>Mocked AddOrEditWoodOrderDetails</div>,
  })
);

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => {
  return jest.fn().mockReturnValue({
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
  });
});

describe('WoodOrderTable component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockTableData as any[],
      isLoading: false,
      selectedWoodOrderID: null,
      setSelectedWoodOrderID: jest.fn(),
      setSelectedWoodOrderDetails: jest.fn(),
      onEditModalSubmit: jest.fn(),
      onDeletion: jest.fn(),
      onCopyPasteClick: jest.fn(),
      completionStatus: false,
      samOfferUId: 'test-uid',
      samOfferId: 123,
    };

    const store = configureMockStore()({
      soStatus: {
        soStatus: 'ReadOnly',
      },
    });

    return renderRootProvider(<WoodOrderTable {...defaultProps} {...props} />, { store });
  };

  test('renders table rows and columns correctly when data is provided', () => {
    renderComponent();

    expect(screen.getByText('WOOD_ORDER_ID')).toBeInTheDocument();
    expect(screen.getByText('CARPENTER')).toBeInTheDocument();

    expect(screen.getByText('Test remark 1')).toBeInTheDocument();
    expect(screen.getByText('Test remark 2')).toBeInTheDocument();

    expect(screen.getByText(2001)).toBeInTheDocument();
    expect(screen.getByText(2002)).toBeInTheDocument();
  });

  test('opens menu when menu item is clicked', async () => {
    renderComponent();

    const menuButton = screen.getAllByRole('button', { name: /more/i })[0];
    fireEvent.click(menuButton);
  });
});
