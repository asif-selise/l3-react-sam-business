import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type NightDeliveryData, type NightDeliveryFilterParams } from './types';
import { getNumberOrNull } from '@/src/helpers/sanitizeData';

const getPostOrderOrGoodsReceiptData = async (params: NightDeliveryFilterParams) => {
  const url = `${environment.serviceBusiness}/Query/GetPostOrderOrGoodsReceiptData`;

  const res = axios.get<ApiResponse<NightDeliveryData[]>>(url, {
    params,
  });

  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useGetPostOrderOrGoodsReceiptData = (
  params: NightDeliveryFilterParams
): UseQueryResult<NightDeliveryData[] | null, Error> => {
  const response = useQuery<NightDeliveryData[] | null, Error>({
    queryKey: ['nightDelivery', params],
    queryFn: async () => await getPostOrderOrGoodsReceiptData(params),
    enabled: !!getNumberOrNull(params.TechnicianEmployeeNumber),
  });

  return response;
};

export default useGetPostOrderOrGoodsReceiptData;
