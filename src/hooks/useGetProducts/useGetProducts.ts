import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type IGetProductsPayload } from './types';
import { type Products } from '../useMasterData/masterData.interface';

const getProducts = async (payload: IGetProductsPayload): Promise<Products[] | null> => {
  const res = await axios.post<ApiResponse<Products[] | null>>(
    `${environment.serviceBusiness}/Query/GetProducts`,
    payload
  );

  const { data } = res;

  if (data.Data && data.StatusCode === 200 && !data.ErrorMessage) {
    return data.Data;
  }

  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }

  return null;
};

export default getProducts;
