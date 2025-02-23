import axios from '@/src/configs/axiosConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ReactNode } from 'react';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { renderHook, waitFor } from '@testing-library/react';
import { type IPrintTableData } from '../useMasterData/masterData.interface';
import usePrintTable from './usePrintTable.hook';

const dummyData = {
  TourDate: '2024-01-25T00:00:00',
  Orders: 5,
  TechnicianEmployeeNumber: 1207,
  FirstName: 'Aeton',
  LastName: 'Sprunger',
  IsTechnician: true,
  IsInstaller: false,
  BranchLocation: '1',
  LoadingLocation: 'Oberbüren',
  Print: false,
};

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/src/configs/axiosConfig');

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<IPrintTableData> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: dummyData as unknown as IPrintTableData,
  TotalCount: 1,
};

describe('test for usePrintTable API call', () => {
  test('get Setup Information data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(() => usePrintTable('2024-03-12', 'Alle', [2, 7], '1'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
