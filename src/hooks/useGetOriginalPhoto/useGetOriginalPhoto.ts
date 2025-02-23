import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type OriginalPhotoData } from './types';

const getOriginalPhoto = async (ServiceOrderNo: number, ServiceType: string, PhotoName: string) => {
  const url = `${environment.serviceBusiness}/Query/GetOriginalPhoto`;

  const res = axios.get<ApiResponse<OriginalPhotoData>>(url, {
    params: {
      ServiceOrderNo,
      ServiceType,
      PhotoName,
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

const useGetOriginalPhoto = (
  ServiceOrderNo: number,
  ServiceType: string,
  PhotoName: string
): UseQueryResult<OriginalPhotoData | null, Error> => {
  const response = useQuery<OriginalPhotoData | null, Error>({
    queryKey: ['photos', ServiceOrderNo, ServiceType, PhotoName],
    queryFn: async () => await getOriginalPhoto(ServiceOrderNo, ServiceType, PhotoName),
    enabled: false,
  });

  return response;
};

export default useGetOriginalPhoto;
