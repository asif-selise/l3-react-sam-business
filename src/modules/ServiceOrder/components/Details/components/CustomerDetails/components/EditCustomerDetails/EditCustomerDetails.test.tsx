import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { fireEvent, screen } from '@testing-library/react';
import EditCustomerDetails from './EditCustomerDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('Testing EditCustomerDetails', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onDiscard: jest.fn(),
      onSaveChanges: jest.fn(),
      customerDetails: {} as any,
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
      getCustomFilteredDataList: jest.fn().mockResolvedValue([]),
    });

    return renderRootProvider(<EditCustomerDetails {...defaultProps} {...props} />);
  };

  test('should render EditCustomerDetails component properly', () => {
    renderComponent();
    expect(screen.getByLabelText('Edit Customer Details Modal')).toBeInTheDocument();
  });
  test('should close the modal', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('DISCARD'));
  });
});
