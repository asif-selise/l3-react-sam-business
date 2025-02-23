import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type CustomerHistoryResponse } from './types';

const getCustomerHistory = async (street: string, postCode: string, productGroupId: number) => {
  const url = `${environment.serviceBusiness}/Query/GetCustomerHistory?Address=${street}&PostCode=${postCode}&ProductGroupId=${productGroupId}`;

  const res = axios.get<ApiResponse<CustomerHistoryResponse[]>>(url);
  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useGetCustomerHistory = (
  street: string,
  postCode: string,
  productGroupId: number
): UseQueryResult<CustomerHistoryResponse[] | null, Error> => {
  const response = useQuery<CustomerHistoryResponse[] | null, Error>({
    queryKey: ['customerHistory', street, postCode, productGroupId],
    queryFn: async () => await getCustomerHistory(street, postCode, productGroupId),
    enabled: false,
  });

  return response;
};

export default useGetCustomerHistory;
