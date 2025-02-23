import React from 'react';
import { screen } from '@testing-library/react';
import DeviceDetails from './DeviceDetails';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import configureMockStore from 'redux-mock-store';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => {
  return jest.fn().mockReturnValue({
    dataItem: {},
    getDataItem: jest.fn().mockResolvedValue({}),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  });
});

jest.mock('./components/EditDeviceDetails', () => {
  const MockEditDeviceDetails = () => (
    <div data-testid="edit-device-details">Edit Device Details</div>
  );
  MockEditDeviceDetails.displayName = 'MockEditDeviceDetails';
  return MockEditDeviceDetails;
});

jest.mock('./components/AddDevice/AddDevice', () => {
  const MockAddDevice = () => <div data-testid="add-device">Add Device</div>;
  MockAddDevice.displayName = 'MockAddDevice';
  return MockAddDevice;
});

jest.mock('../Measurement/MeasureEquipment', () => {
  const MockMeasureEquipment = () => <div data-testid="measure-equipment">Measure Equipment</div>;
  MockMeasureEquipment.displayName = 'MockMeasureEquipment';
  return MockMeasureEquipment;
});

describe('DeviceDetails Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      deviceData: null,
      getDeviceData: jest.fn().mockResolvedValue({}),
      deviceDataList: [],
      getDeviceDataList: jest.fn().mockResolvedValue([]),
      updateDeviceDataList: jest.fn().mockResolvedValue(undefined),
      setDeviceDetailsLoaded: jest.fn(),
    };

    const store = configureMockStore()({
      serviceOrder: {
        id: 1,
      },
      soStatus: {
        soStatus: 'ReadOnly',
      },
    });

    renderRootProvider(<DeviceDetails {...defaultProps} {...props} />, { store });
  };

  test('should render device details component properly', async () => {
    renderComponent();

    expect(screen.getByLabelText('Device Details')).toBeInTheDocument();
    expect(screen.getByText('DEVICE_DETAILS')).toBeInTheDocument();
    expect(screen.getByText('BANDUNG')).toBeInTheDocument();
    expect(screen.getByText('OPERATION_HOURS')).toBeInTheDocument();
  });
});
