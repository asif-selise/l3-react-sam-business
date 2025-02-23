import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import NightDelivery from './NightDelivery';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('NightDelivery', () => {
  const onClose = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose,
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<NightDelivery {...defaultProps} {...props} />);
  };

  it('should render the NightDelivery component', () => {
    renderComponent();

    expect(screen.getAllByText('POST_GOODS_RECEIPTS_FOR_OVERNIGHT_DELIVERIES')).toHaveLength(2);
  });

  it('should render the NightDeliveryTable component', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should call onClose when the modal is closed', () => {
    renderComponent();

    const closeButton = screen.getByLabelText('DISCARD');
    closeButton.click();

    expect(onClose).toHaveBeenCalled();
  });
});
