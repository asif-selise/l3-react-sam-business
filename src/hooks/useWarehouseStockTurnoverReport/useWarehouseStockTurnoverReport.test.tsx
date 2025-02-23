import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import useWarehouseStockTurnoverReport from '@/src/hooks/useWarehouseStockTurnoverReport/useWarehouseStockTurnoverReport.hook';

jest.mock('@/src/configs/axiosConfig');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<string> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: 'MockBase64Pdf',
  TotalCount: 1,
};

describe('useWarehouseStockTurnoverReport hook', () => {
  const fromDate = '2024-01-01';
  const toDate = '2024-01-31';
  const technicianEmployeeNumber = 12345;

  test('fetches warehouse stock turnover report successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockedResponse });

    const { result } = renderHook(
      () => useWarehouseStockTurnoverReport(fromDate, toDate, technicianEmployeeNumber),
      { wrapper }
    );

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(mockedResponse.Data);
  });
});
