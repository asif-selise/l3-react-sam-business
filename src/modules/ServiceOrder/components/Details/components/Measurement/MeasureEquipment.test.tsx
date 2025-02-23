import { screen } from '@testing-library/react';
import MeasureEquipment from './MeasureEquipment';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    dataItem: {},
    getDataItem: jest.fn(),
    dataList: [],
    getDataList: jest.fn(),
    updateDataLists: jest.fn(),
  })
);

jest.mock('@/src/hooks/useMeasurement/useMeasurement.hooks', () =>
  jest.fn().mockReturnValue({
    runMeasurement: jest.fn().mockResolvedValue({}),
    result: {
      status: 'initial',
      message: 'Measurement started',
    },
    setResult: jest.fn(),
    xmlResponse: '',
  })
);

const store = configureMockStore()({
  serviceOrder: {
    id: 56,
  },
  soStatus: {
    soStatus: 'ReadOnly',
  },
});

describe('MeasureEquipment', () => {
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.open = jest.fn();
  });

  test('should disable button if no device is selected', () => {
    renderRootProvider(<MeasureEquipment open={true} onCancel={onCancel} />, { store });

    const startMeasurementButton = screen.getByText('START_MEASUREMENT');
    const informationButton = screen.getByText('INFORMATION_ABOUT_THE_SELECTED_MEASUREMENT');

    expect(startMeasurementButton).toBeDisabled();
    expect(informationButton).toBeDisabled();
  });

  // test('should open PDF in new tab when "START_MEASUREMENT" button is clicked', () => {
  //   renderRootProvider(<MeasureEquipment open={true} onCancel={onCancel} />, { store });

  //   const selectDropdown = screen.getAllByRole('combobox');
  //   const selectDevice = selectDropdown[0];

  //   fireEvent.mouseDown(selectDevice);

  //   const selectedDevice = screen.getByText('PLUGGED_DEVICE_SKL2');

  //   fireEvent.click(selectedDevice);

  //   fireEvent.click(screen.getByText('INFORMATION_ABOUT_THE_SELECTED_MEASUREMENT'));

  //   expect(global.open).toHaveBeenCalledWith(
  //     '@/public/assets/pdfs/MessungenSK2Gesteckt.pdf',
  //     '_blank'
  //   );
  // });
});
