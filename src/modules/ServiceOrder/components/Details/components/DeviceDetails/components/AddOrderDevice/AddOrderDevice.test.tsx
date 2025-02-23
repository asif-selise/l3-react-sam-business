import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AddOrderDevice from './AddOrderDevice';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/indexedDb', () => ({
  getData: jest.fn(),
}));
jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('AddOrderDevice', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onSubmitForm: jest.fn(),
      onClose: jest.fn(),
      data: {},
      fields: {},
      setFields: jest.fn(),
      temporaryApartmentGId: '1',
      temporaryObjectId: 1,
      openMeasurement: jest.fn(),
      onScanQrCode: jest.fn(),
      addEditOrderDeviceType: 'add' as 'add' | 'edit',
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [],
      getDataList: jest.fn(),
    });

    return renderRootProvider(<AddOrderDevice {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByLabelText('Add Order Device Modal')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('MANUFACTURER')).toBeInTheDocument();
    expect(screen.getByLabelText('PRODUCT_GROUP')).toBeInTheDocument();
    expect(screen.getByText('SERIAL_NO')).toBeInTheDocument();
  });
});
