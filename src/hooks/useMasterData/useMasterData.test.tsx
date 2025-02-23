import * as indexedDb from '@/indexedDb';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { type MasterData } from './masterData.interface';
import useMasterData from './useMasterData.hooks';

jest.mock('@/indexedDb');
const mockedFn = jest.fn();
jest.spyOn(indexedDb, 'storeData').mockImplementationOnce(() => mockedFn());

const dummyData = { masterData: true };

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/src/configs/axiosConfig');

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<MasterData> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: dummyData as unknown as MasterData,
  TotalCount: 1,
};

describe('test for useMasterData api call', () => {
  test('get master data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(() => useMasterData(), { wrapper });
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
