import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { type ISak7000DataResponse } from './types';
import useSak7000Data from './useSak7000Data';

const mockData = {
  Source: 'Sensor-1',
  Quality: 98,
  ID: 101,
  Text1: 'Temperature stable',
  Text2: 'No significant changes in temperature over the last hour.',
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

const mockedResponse: ApiResponse<ISak7000DataResponse> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: mockData as unknown as ISak7000DataResponse,
  TotalCount: 1,
};

describe('test for useSak7000Data api call', () => {
  test('get useSak7000Data data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(
      () =>
        useSak7000Data({
          TopRecordNumber: 26,
          RsLine: true,
          Avor: true,
          SearchMode: '',
          Filter: '',
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
