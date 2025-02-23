import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import EditDeviceDetails from './EditDeviceDetails';
import { type IEditDeviceData } from '../DeviceDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    dataList: [],
    getDataList: jest.fn(),
  })),
}));

const mockedOpen = true;
const mockedOnDiscard = jest.fn();
const mockedOnSaveChanges = jest.fn();

const testData: IEditDeviceData = {
  orderId: 1,
  bandung: 'Test Bandung',
  productGroup: 56,
  model: 'Test Model',
  serialNumber: '123456',
  productNo: '78910',
  operationHours: 100,
  productionDate: '2023-07-01',
  installationDate: new Date('2023-07-10'),
  color: 'Blue',
  serviceOrderDetails: 'Test Service Order Details',
  manufacturer: null,
};

describe('Testing EditDeviceDetails', () => {
  beforeEach(() => {
    (useIndexedDbData as jest.Mock).mockImplementation(() => ({
      dataList: [
        {
          Id: 1,
          Number: 1,
          Name: 'Manufacturer A',
          By: null,
          NameWithoutNumberAtTheEnd: 'Manufacturer',
          NameWithNumberAtTheEnd: 'Manufacturer A',
        },
        {
          Id: 2,
          Number: 2,
          Name: 'Manufacturer B',
          By: null,
          NameWithoutNumberAtTheEnd: 'Manufacturer',
          NameWithNumberAtTheEnd: 'Manufacturer B',
        },
      ],
      getDataList: jest.fn(),
    }));

    renderRootProvider(
      <EditDeviceDetails
        open={mockedOpen}
        onDiscard={mockedOnDiscard}
        onSaveChanges={mockedOnSaveChanges}
        data={testData}
      />
    );
  });

  test('should render EditDeviceDetails component properly', () => {
    expect(screen.getByLabelText('Edit Device Details Modal')).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getByLabelText('BRAND')).toBeInTheDocument();
      expect(screen.getByLabelText('BANDUNG')).toBeInTheDocument();
      expect(screen.getByLabelText('SERIAL_NUMBER')).toBeInTheDocument();
      expect(screen.getByLabelText('PRODUCT_NO')).toBeInTheDocument();
      expect(screen.getByLabelText('OPERATION_HOURS')).toBeInTheDocument();
      expect(screen.getByLabelText('PRODUCTION_DATE')).toBeInTheDocument();
      expect(screen.getByLabelText('INSTALLATION_DATE')).toBeInTheDocument();
    });
  });

  test('should close the modal on discard', async () => {
    fireEvent.click(screen.getByText('DISCARD'));
    await waitFor(() => {
      expect(mockedOnDiscard).toHaveBeenCalledTimes(1);
    });
  });

  test('should call onSaveChanges with correct data on save changes', () => {
    waitFor(() => {
      const productNoField = screen.getByLabelText('PRODUCT_NO');
      fireEvent.change(productNoField, { target: { value: '123456' } });

      const productionDateField = screen.getByLabelText('PRODUCTION_DATE');
      fireEvent.change(productionDateField, { target: { value: '2023-07-01' } });

      fireEvent.click(screen.getByText('SAVE'));
    });

    waitFor(
      () => {
        expect(mockedOnSaveChanges).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );

    waitFor(() => {
      expect(mockedOnSaveChanges).toHaveBeenCalledWith({
        ...testData,
        installationDate: expect.any(Date),
      });
    });
  });

  test('should set today date for installation date on clicking TODAY button', () => {
    const todayButton = screen.getByText('TODAY');
    fireEvent.click(todayButton);

    waitFor(() => {
      const todayDate = new Date();
      const installationDateField = screen.getByLabelText('INSTALLATION_DATE');
      expect(installationDateField).toHaveValue(
        `${todayDate.getFullYear()}.${String(todayDate.getMonth() + 1).padStart(2, '0')}.${String(todayDate.getDate()).padStart(2, '0')}`
      );
    });
  });
});
