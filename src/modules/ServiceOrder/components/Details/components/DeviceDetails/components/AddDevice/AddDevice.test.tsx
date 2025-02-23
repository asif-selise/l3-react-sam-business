import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import AddDevice from './AddDevice';

jest.mock('@/indexedDb', () => ({
  getData: jest.fn(),
}));

jest.mock('../../../ProductSearch/ProductSearch', () => {
  const Mock = () => <div aria-label="PRODUCT_SEARCH">Product Search</div>;
  return Mock;
});

jest.mock('../AddOrderDevice/AddOrderDevice', () => {
  const Mock = () => <div aria-label="ADD_ORDER_DEVICE">Add Order Device</div>;
  return Mock;
});

jest.mock('@/src/modules/ServiceOrder/components/QRCode/components/ScanQRCode/ScanQRCode', () => {
  const Mock = () => <div aria-label="SCAN_QR_CODE">Scan QR Code</div>;
  return Mock;
});

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('AddDevice', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose: jest.fn(),
      dataDevice: {},
      onCopyDeviceToSO: jest.fn(),
      deviceData: null,
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [
        {
          Id: 1,
          OrderId: 1,
          ProductId: 1,
          ProductName: 'Product 1',
          ProductCode: 'P1',
          Quantity: 1,
          Price: 10,
          Total: 10,
          OrderDeviceId: 1,
        },
      ],
      getDataList: jest.fn(),
      filteredDataList: [],
      getFilteredDataList: jest.fn(),
      updateDataLists: jest.fn(),
      isLoading: false,
    });

    return renderRootProvider(<AddDevice {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByLabelText('ADD_DEVICE')).toBeInTheDocument();
  });

  it('should render ProductSearch when add new item button is clicked', async () => {
    renderComponent();

    const buttonAddNew = screen.getByRole('button', { name: 'ADD_NEW_ITEM' });

    await user.click(buttonAddNew);

    expect(screen.getByRole('heading', { name: 'PRODUCT_SEARCH' })).toBeInTheDocument();
  });

  it('should render AddOrderDevice when add new item button is clicked and product is selected', async () => {
    renderComponent();

    const buttonAddNew = screen.getByRole('button', { name: 'ADD_NEW_ITEM' });

    await user.click(buttonAddNew);

    waitFor(async () => {
      const productList = screen.getAllByLabelText('product-row');
      expect(productList.length).toBeGreaterThan(0);
      await user.click(productList[0]);
      expect(screen.getByLabelText('ADD_ORDER_DEVICE')).toBeInTheDocument();
    });
  });
});
