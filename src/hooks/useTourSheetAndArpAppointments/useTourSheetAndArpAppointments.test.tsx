import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type ITourSheetAndArpDatesData } from '@/src/modules/DataMenu/components/InfoSection/components/TourSheetAndArpDates/interfaces';
import useTourSheetAndArpAppointments from './useTourSheetAndArpAppointments.hook';

jest.mock('@/src/configs/axiosConfig');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockData = {
  Day: 'Mi',
  Date: '19.06.2024',
  Status: 'Tourenblatt',
  Text: '[06:00] Ferien\r\n\r\n[06:30] Ferien\r\n\r\n[07:00] Ferien\r\n\r\n[07:30] Ferien\r\n\r\n[08:00] Ferien\r\n\r\n[09:00] Ferien\r\n\r\n[10:00] Ferien\r\n\r\n[11:00] Ferien\r\n\r\n[11:30] Ferien\r\n\r\n[12:00] Ferien\r\n\r\n[13:00] Ferien\r\n\r\n[13:30] Ferien\r\n\r\n[14:00] Ferien\r\n\r\n[15:00] Ferien\r\n\r\n[16:00] Ferien\r\n\r\n[17:00] Ferien\r\n\r\n[18:00] Ferien\r\n\r\n[19:00] Ferien',
  IsRouteSheet: true,
  IsARP: false,
};

const mockedResponse: ApiResponse<ITourSheetAndArpDatesData> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: mockData,
  TotalCount: 1,
};

describe('useTourSheetAndArpAppointments hook', () => {
  const fromDate = '2024-01-01';
  const toDate = '2024-01-31';
  const technicianEmployeeId = 12345;

  test('fetches warehouse stock turnover report successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockedResponse });

    const { result } = renderHook(
      () => useTourSheetAndArpAppointments(fromDate, toDate, technicianEmployeeId),
      { wrapper }
    );

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(mockedResponse.Data);
  });
});
