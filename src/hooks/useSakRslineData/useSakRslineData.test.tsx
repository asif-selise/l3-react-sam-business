import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import useSakRslineData from './useSakRslineData';
import { type ISakRsLineDataResponse } from './types';

const mockData = {
  OrderNo: 1001,
  ManufacturerNo: 200,
  ProductGroupNo: 10,
  Challenge: 'Quality check',
  Remarks: 'All units passed the inspection.',
  DoneBy: 'John Doe',
  DoneOn: '2024-11-01T10:30:00',
  Author: 'Jane Smith',
  RecordedBy: 'Alice Brown',
  RecordedOn: '2024-11-01T11:00:00',
  RslineId: 501,
};

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<ISakRsLineDataResponse> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: mockData as unknown as ISakRsLineDataResponse,
  TotalCount: 1,
};

describe('test for useSakRslineData hook call', () => {
  test('get useSakRslineData data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(
      () =>
        useSakRslineData({
          Challenge: 'Quality Check',
          FromDate: '2024-11-01',
          ToDate: '2024-11-10',
          Remarks: 'Inspection completed successfully.',
          DoneBy: 'John Doe',
          ProductGroupNo: 2,
          OrderNo: 11,
          ManufacturerNo: 43,
          RslineId: 45,
        }),
      {
        wrapper,
      }
    );
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
