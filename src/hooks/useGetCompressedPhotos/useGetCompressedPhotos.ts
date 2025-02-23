import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type PhotoData } from './types';

const getCompressedPhotos = async (ServiceOrderNo: number, ServiceType: string) => {
  const url = `${environment.serviceBusiness}/Query/GetCompressedPhotos`;

  const res = axios.get<ApiResponse<PhotoData[]>>(url, {
    params: {
      ServiceOrderNo,
      ServiceType,
    },
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

const useGetCompressedPhotos = (
  ServiceOrderNo: number,
  ServiceType: string
): UseQueryResult<PhotoData[] | null, Error> => {
  const response = useQuery<PhotoData[] | null, Error>({
    queryKey: ['photos', ServiceOrderNo, ServiceType],
    queryFn: async () => await getCompressedPhotos(ServiceOrderNo, ServiceType),
  });

  return response;
};

export default useGetCompressedPhotos;
