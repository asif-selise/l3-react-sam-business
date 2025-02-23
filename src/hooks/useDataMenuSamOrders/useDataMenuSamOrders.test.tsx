import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from '@/src/configs/axiosConfig';
import { type ReactNode } from 'react';
import useDataMenuSamOrders from './useDataMenuSamOrders';
import { type IDataMenuSamOrdersResponse } from './types';

const mockData = {
  IsNightOrder: false,
  IsBooked: true,
  OrderedDate: '2007-12-24T00:00:00',
  OrderId: null,
  SamOrderId: 6323,
  AppointmentDate: null,
  OrderedQuantity: 1.0,
  ReceivedQuantity: 1.0,
  ManufacturerId: 300,
  ManufacturerName: 'V-Zug',
  ManufacturerArticleNumber: 'W78731',
  ListPriceExclTax: 3.5316,
  DeliveryNumber: '39-149-760',
  SamOrderDetailId: 16444,
  IsPartialDelivery: false,
  ProductId: 608737,
  ProductDescription: 'Kupplungsstutzen',
};
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/src/configs/axiosConfig');

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

const mockedResponse: ApiResponse<IDataMenuSamOrdersResponse> = {
  StatusCode: 200,
  ErrorMessage: null,
  Message: null,
  Data: mockData as unknown as IDataMenuSamOrdersResponse,
  TotalCount: 1,
};

describe('test for useDataMenuSamOrders api call', () => {
  test('get view orders table data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockedResponse });

    const { result } = renderHook(
      () =>
        useDataMenuSamOrders({
          TechnicianEmployeeNumber: 26,
          WarehouseLocationId: 103,
          OrderId: '',
          SamOrderId: '',
          ManufacturerName: '',
          ManufacturerArticleNumber: '',
          ProductDescription: '',
          BookedState: false,
        }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data).toEqual(mockData);
    });
  });
});
