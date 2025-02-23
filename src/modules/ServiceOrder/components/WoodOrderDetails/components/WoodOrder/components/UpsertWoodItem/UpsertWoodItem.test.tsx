import UpsertWoodItem from './UpsertWoodItem';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
  })),
}));

const mockOnClose = jest.fn();
const mockOnSubmitForm = jest.fn();

describe('UpsertWoodItem component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      type: 'add' as 'add' | 'edit',
      onClose: mockOnClose,
      onSubmitForm: mockOnSubmitForm,
      samOfferUId: null,
      samOfferId: null,
    };

    return renderRootProvider(<UpsertWoodItem {...defaultProps} {...props} />);
  };

  test('renders properly with "add" type', () => {
    renderComponent();

    expect(screen.getByLabelText('Edit Device Details Modal')).toBeInTheDocument();
    expect(screen.getByText('CARPENTER')).toBeInTheDocument();
    expect(screen.getAllByText('ORDERED_ON')).toHaveLength(2);
    expect(screen.getByText('CREATED_ON')).toBeInTheDocument();
    expect(screen.getByText('DONE_OR_DEACTIVATED')).toBeInTheDocument();
  });

  test('calls onClose when "DISCARD" button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('DISCARD'));
    expect(mockOnClose).toHaveBeenCalledWith('close');
  });

  test('renders "edit" type correctly and handles default values', async () => {
    const editData = {
      WoodOrderId: 1,
      SamOfferUId: 'test-uid-1',
      OrderId: 101,
      Remark: 'Test remark 1',
      CreatedOn: '1997-11-25',
      CreatedBy: 'User1',
      ChangedBy: 'Admin1',
      OrderedOn: '1997-11-25',
      OrderedBy: 'Client1',
      SamOfferId: 501,
      ColorDefinition: 'Blue',
      WoodOrderManufacturerId: 1001,
      CompletedOrDeactivated: true,
      TechnicianEmployeeNumber: 2001,
      ManufacturerKitchen: 'Kitchen1',
      PhotoManufacturerLabelMade: 'photo1.jpg',
    };

    renderComponent({ type: 'edit', editData });

    waitFor(() => {
      expect(screen.getByDisplayValue(1001)).toBeInTheDocument();
      expect(screen.getByLabelText('COLOR_DEFINITION')).toHaveValue(editData.ColorDefinition);
      expect(screen.getByLabelText('Remarks')).toHaveValue(editData.Remark);
    });
  });
});
