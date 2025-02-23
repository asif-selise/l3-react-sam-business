import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type IGetProductsPayload } from './types';
import { type Products } from '../useMasterData/masterData.interface';
import { useMutation } from '@tanstack/react-query';
import { checkLocalServerStatus } from '../useCheckLocalServerStatus/useCheckLocalServerStatus.hook';

const getURL = async () => {
  const localBaseUrl = `${environment.samLocalUrl}/PingQuery`;
  const localServerStatus = await checkLocalServerStatus(localBaseUrl);
  const baseUrlFromEnv = localServerStatus
    ? environment.samLocalUrl
    : `${environment.serviceBusiness}/Query`;
  return `${baseUrlFromEnv}/GetProducts`;
};

export const getProducts = async (payload: IGetProductsPayload): Promise<Products[] | null> => {
  const url = await getURL();
  const res = await axios.post<ApiResponse<Products[] | null>>(url, payload);

  const { data } = res;

  if (data.Data && data.StatusCode === 200 && !data.ErrorMessage) {
    return data.Data;
  }

  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }

  return null;
};

const useGetProducts = () => {
  const mutation = useMutation({
    mutationFn: async (payload: IGetProductsPayload) => {
      return await getProducts(payload);
    },
  });

  const submitUpdate = (updateData: IGetProductsPayload) => {
    mutation.mutate(updateData);
  };

  const response = {
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error?.message,
  };

  return { submitUpdate, response };
};

export default useGetProducts;
