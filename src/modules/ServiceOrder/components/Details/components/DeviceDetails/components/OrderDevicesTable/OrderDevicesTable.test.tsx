import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import OrderDevicesTable from './OrderDevicesTable';

describe('OrderDevicesTable', () => {
  const mockedTableData = [
    {
      Id: '1',
      ManufacturerId: '1',
      Manufacturer: 'Manufacturer 1',
      ProductGroupId: '1',
      ProductGroup: 'Product Group 1',
      Model: 'Model 1',
      SerialNo: 'Serial No 1',
      ProductNo: 'Product No 1',
      InstallationDate: '2022-01-01',
      AsamMeasurement: 'Asam Measurement 1',
      Device: 'Device 1',
      DeviceOrderNo: 'Device Order No 1',
    },
    {
      Id: '2',
      ManufacturerId: '2',
      Manufacturer: 'Manufacturer 2',
      ProductGroupId: '2',
      ProductGroup: 'Product Group 2',
      Model: 'Model 2',
      SerialNo: 'Serial No 2',
      ProductNo: 'Product No 2',
      InstallationDate: '2022-01-02',
      AsamMeasurement: 'Asam Measurement 2',
      Device: 'Device 2',
      DeviceOrderNo: 'Device Order No 2',
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
      activeOrderDeviceRow: undefined,
      setActiveOrderDeviceRow: jest.fn(),
      onEditOrderDevice: jest.fn(),
      onDeleteOrderDevice: jest.fn(),
    };

    return renderRootProvider(<OrderDevicesTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('PRODUCT_GROUP')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();
    expect(screen.getByText('ASAM_MEASUREMENT')).toBeInTheDocument();
  });
});
