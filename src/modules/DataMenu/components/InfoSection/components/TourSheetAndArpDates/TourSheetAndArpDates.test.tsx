import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import TourSheetAndArpDates from './TourSheetAndArpDates';
import configureMockStore from 'redux-mock-store';
import useTourSheetAndArpAppointments from '@/src/hooks/useTourSheetAndArpAppointments/useTourSheetAndArpAppointments.hook';

jest.mock('@/src/hooks/useTourSheetAndArpAppointments/useTourSheetAndArpAppointments.hook', () =>
  jest.fn()
);

global.URL.createObjectURL = jest.fn();
const mockOnClose = jest.fn();
const mockedTableData = [
  {
    Day: 'Mi',
    Date: '19.06.2024',
    Status: 'Tourenblatt',
    Text: '[06:00] Ferien\r\n\r\n[06:30] Ferien\r\n\r\n[07:00] Ferien\r\n\r\n[07:30] Ferien\r\n\r\n[08:00] Ferien\r\n\r\n[09:00] Ferien\r\n\r\n[10:00] Ferien\r\n\r\n[11:00] Ferien\r\n\r\n[11:30] Ferien\r\n\r\n[12:00] Ferien\r\n\r\n[13:00] Ferien\r\n\r\n[13:30] Ferien\r\n\r\n[14:00] Ferien\r\n\r\n[15:00] Ferien\r\n\r\n[16:00] Ferien\r\n\r\n[17:00] Ferien\r\n\r\n[18:00] Ferien\r\n\r\n[19:00] Ferien',
    IsRouteSheet: true,
    IsARP: false,
  },
];

describe('TourSheetAndArpDates', () => {
  beforeEach(() => {
    (useTourSheetAndArpAppointments as jest.Mock).mockReturnValue({
      data: mockedTableData,
      refetch: jest.fn().mockResolvedValue({ data: mockedTableData }),
      isLoading: false,
    });
  });

  const store = configureMockStore()({
    snackbar: {
      snackbarQueue: [
        {
          key: 'snackbar_id_1',
          isVisible: true,
          type: 'success',
          title: 'Success snackbar',
        },
        {
          key: 'snackbar_id_2',
          isVisible: true,
          type: 'error',
          title: 'Error snackbar',
        },
      ],
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the modal with form fields', () => {
    renderRootProvider(<TourSheetAndArpDates onClose={mockOnClose} />, { store });

    expect(screen.getByLabelText('FROM')).toBeInTheDocument();
    expect(screen.getByLabelText('TO')).toBeInTheDocument();
    expect(screen.getByText('FILTER')).toBeInTheDocument();
    expect(screen.getByText('DISCARD')).toBeInTheDocument();
  });
});
