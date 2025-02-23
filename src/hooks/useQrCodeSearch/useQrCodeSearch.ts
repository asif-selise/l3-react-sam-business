import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type QrFilterParams } from './types';
import { type QrCodeDetail } from '@/src/hooks/useTourData/tourData.interface';

const getQrCodeSearch = async (params: QrFilterParams) => {
  const url = `${environment.serviceBusiness}/Query/QrCodeSearch`;

  const res = axios.get<ApiResponse<QrCodeDetail>>(url, {
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

const useQrCodeSearch = (params: QrFilterParams): UseQueryResult<QrCodeDetail | null, Error> => {
  const response = useQuery<QrCodeDetail | null, Error>({
    queryKey: ['searchQrcode', params],
    queryFn: async () => await getQrCodeSearch(params),
    enabled: false,
  });

  return response;
};

export default useQrCodeSearch;
