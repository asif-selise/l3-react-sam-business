import axios from '@/src/configs/axiosConfig';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type Products } from '../useMasterData/masterData.interface';
import { getCustomTableSettings } from '@/src/components/CustomTable/utilities';
import environment from '@/environment';
import { checkLocalServerStatus } from '../useCheckLocalServerStatus/useCheckLocalServerStatus.hook';

export type IProductType = 'article' | 'device';

const getURL = async (
  type: IProductType,
  pageNumber: number,
  filter?: string,
  productId?: string,
  rowPerPage?: number
) => {
  const productType: number = type === 'device' ? 0 : 1;

  const localBaseUrl = `${environment.samLocalUrl}/PingQuery`;

  const localServerStatus = await checkLocalServerStatus(localBaseUrl);

  const baseUrlFromEnv = localServerStatus
    ? environment.samLocalUrl
    : `${environment.serviceBusiness}/Query`;

  let rowInPage = rowPerPage;

  if (rowInPage === 0) {
    const tableInfo = getCustomTableSettings('ProductsTable');
    rowInPage = tableInfo?.rowsPerPage;
    if (rowInPage === undefined || rowInPage === null) {
      rowInPage = 5;
    }
  }

  const baseURL = `${baseUrlFromEnv}/GetPaginatedProductsAsync?PageNumber=${pageNumber}&RowsPerPage=${rowInPage}&Type=${productType}`;

  const urlWithFilter = filter ? `${baseURL}&Filter=${filter}` : baseURL;

  const finalURL = productId ? `${urlWithFilter}&ProductId=${productId}` : urlWithFilter;

  return finalURL;
};

export const getPaginatedProducts = async (
  type: IProductType,
  pageNumber: number,
  filter?: string,
  productId?: string,
  rowPerPage?: number
) => {
  const url = await getURL(type, pageNumber, filter, productId, rowPerPage);

  const res = await axios.get<ApiResponse<Products[]>>(url);

  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useGetPaginatedProducts = (
  type: IProductType,
  pageNumber: number,
  filter?: string,
  productId?: string,
  rowPerPage?: number
): UseQueryResult<ApiResponse<Products[]> | null, Error> =>
  useQuery<ApiResponse<Products[]> | null, Error>({
    queryKey: ['getPaginatedProducts', type, pageNumber, filter, productId, rowPerPage],
    queryFn: async () =>
      await getPaginatedProducts(type, pageNumber, filter, productId, rowPerPage),
    enabled: !!pageNumber,
  });

export default useGetPaginatedProducts;
