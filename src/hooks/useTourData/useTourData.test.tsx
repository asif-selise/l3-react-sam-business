import * as indexedDb from '@/indexedDb';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { type TourDataResponse } from './tourData.interface';
import useTourData from './useTourData.hooks';

jest.mock('@/indexedDb');
const mockedFn = jest.fn();
jest.spyOn(indexedDb, 'storeData').mockImplementationOnce(() => mockedFn());

const dummyData = { tourData: true };

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/src/configs/axiosConfig');

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<TourDataResponse> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: dummyData as unknown as TourDataResponse,
  TotalCount: 1,
};

describe('test for useTourData api call', () => {
  test('get tour data successfully', () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(
      () =>
        useTourData('56', `2024-04-01`, true, {
          technicianId: 56,
          technicianEmployeeNumber: 56,
          technicianName: 'Mahadi Al Hassan',
          systemUser: 'mahadi97',
        }),
      { wrapper }
    );

    waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data).toEqual(dummyData);
    });
  });
});
