import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type IDataMenuSamOrdersResponse } from './types';
import { type IDataMenuSamOrdersRequestParams } from '@/src/modules/DataMenu/components/OrderSection/types';

const getDataMenuSamOrders = async (ordersData: IDataMenuSamOrdersRequestParams) => {
  const {
    TechnicianEmployeeNumber,
    WarehouseLocationId,
    OrderId,
    SamOrderId,
    ManufacturerName,
    ManufacturerArticleNumber,
    ProductDescription,
    BookedState,
  } = ordersData;

  const params = [
    TechnicianEmployeeNumber
      ? `TechnicianEmployeeNumber=${encodeURIComponent(TechnicianEmployeeNumber)}`
      : '',
    WarehouseLocationId ? `WarehouseLocationId=${encodeURIComponent(WarehouseLocationId)}` : '',
    OrderId ? `OrderId=${encodeURIComponent(OrderId)}` : '',
    SamOrderId ? `SamOrderId=${encodeURIComponent(SamOrderId)}` : '',
    ManufacturerName ? `ManufacturerName=${encodeURIComponent(ManufacturerName)}` : '',
    ManufacturerArticleNumber
      ? `ManufacturerArticleNumber=${encodeURIComponent(ManufacturerArticleNumber)}`
      : '',
    ProductDescription ? `ProductDescription=${encodeURIComponent(ProductDescription)}` : '',
    BookedState ? `BookedState=${encodeURIComponent(BookedState)}` : '',
  ];

  const queryString = params.filter(Boolean).join('&');

  const url = `${environment.serviceBusiness}/Query/DataMenuSamOrders?${queryString}`;
  const { data } = await axios.get<ApiResponse<IDataMenuSamOrdersResponse[]>>(url);

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useDataMenuSamOrders = (
  ordersRequestParams: IDataMenuSamOrdersRequestParams
): UseQueryResult<IDataMenuSamOrdersResponse[] | null, Error> => {
  const response = useQuery<IDataMenuSamOrdersResponse[] | null, Error>({
    queryKey: [
      'dataMenuSamOrders',
      ordersRequestParams.BookedState,
      ordersRequestParams.ManufacturerArticleNumber,
      ordersRequestParams.ManufacturerName,
      ordersRequestParams.OrderId,
      ordersRequestParams.ProductDescription,
      ordersRequestParams.SamOrderId,
      ordersRequestParams.TechnicianEmployeeNumber,
      ordersRequestParams.WarehouseLocationId,
    ],
    queryFn: async () => await getDataMenuSamOrders(ordersRequestParams),
    enabled:
      !!ordersRequestParams.TechnicianEmployeeNumber && !!ordersRequestParams.WarehouseLocationId,
  });

  return response;
};

export default useDataMenuSamOrders;
