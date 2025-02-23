import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import { type CustomerHistoryResponse } from './types';
import useGetCustomerHistory from './useGetCustomerHistory';

const mockData: CustomerHistoryResponse[] = [
  {
    OrderId: 22429301,
    ManagementId: 7262,
    CreatedAt: '2023-12-13T10:47:36.763',
    DocumentDate: '2024-01-03T00:00:00',
    CustomerPhone: '0793632499',
    CustomerAddress: 'Kreipl  Morteza , Sankt Gallerstrasse 6 , 8716 Schmerikon',
    Manufacturer: 'Diverse Marken',
    ProductGroup: 60,
    DeviceModel: 'IK107000R + DAL5536WE',
    SerialNumber: '',
    ProductNo: '',
    ProductColor: '',
    Brand: '',
    OperatingStartDate: '03.01.2024',
    Status: 'X',
    Revenue: 2377.15,
    FaultReport:
      'Neugeräte geliefert und eingebaut, Altgeräte entsorgt, Sicherheitskontrolle durchgeführt\r\n\r\n*Besten Dank für Ihren Auftrag*',
    LastST: 'Seghid Hugener',
    AppointmentDate: '2024-01-03T00:00:00',
    ReportSort1: 1,
    ReportSort2: 4,
    Street: 'Sankt Gallerstrasse 6',
    PostalCode: '8716',
  },
];

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/src/configs/axiosConfig');

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<CustomerHistoryResponse[]> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: mockData,
  TotalCount: 1,
};

describe('test for useGetCustomerHistory api call', () => {
  test('get customer history data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });
    const { result } = renderHook(() => useGetCustomerHistory('Sankt Gallerstrasse', '8716', 35), {
      wrapper,
    });
    const refetchResponse = await result.current.refetch();

    await waitFor(() => {
      expect(refetchResponse.data).toBeDefined();
      expect(refetchResponse.data).toEqual(mockData);
    });
  });
});
