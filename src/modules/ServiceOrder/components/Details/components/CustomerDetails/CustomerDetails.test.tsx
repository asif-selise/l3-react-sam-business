import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import CustomerDetails from './CustomerDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('Testing CustomerDetails', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      customerDetailsData: null,
      getCustomerDetailsData: jest.fn().mockResolvedValue(undefined),
      soDetailsList: [],
      getSODetailsList: jest.fn().mockResolvedValue([]),
      updateCustomerDataList: jest.fn().mockResolvedValue([]),
      setCustomerDetailsLoaded: jest.fn(),
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<CustomerDetails {...defaultProps} {...props} />);
  };

  test('should render customer details component properly', () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByText('EMAIL')).toBeInTheDocument();
      expect(screen.getByText('EDIT')).toBeInTheDocument();
      expect(screen.getByLabelText('Customer Details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('EDIT'));

    waitFor(() => {
      expect(screen.getByLabelText('EDIT_CUSTOMER_DETAILS')).toBeInTheDocument();
    });
  });

  test('should open Edit Customer Details Modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('EDIT'));
    waitFor(() => {
      expect(screen.getByLabelText('EDIT_CUSTOMER_DETAILS')).toBeInTheDocument();
    });
  });
});
