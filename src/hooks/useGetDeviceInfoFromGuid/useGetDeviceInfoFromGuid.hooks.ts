import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type DeviceInfoFromGuid } from './interface';

const getDeviceInfoFromGuid = async (qrGUID: string) => {
  const url = `${environment.serviceBusiness}/Query/GetDeviceInfoFromGuid?DeviceGuid=${qrGUID}`;

  const res = await axios.get<ApiResponse<DeviceInfoFromGuid>>(url);
  const { data } = res;

  if (data.StatusCode === 200 && data.Data && !data.ErrorMessage) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }

  return null;
};

const useGetDeviceInfoFromGuid = (
  qrGUID: string
): UseQueryResult<DeviceInfoFromGuid | null, Error> => {
  return useQuery<DeviceInfoFromGuid | null, Error>({
    queryKey: ['useGetDeviceInfoFromGuid', qrGUID],
    queryFn: async () => await getDeviceInfoFromGuid(qrGUID),
    enabled: !!qrGUID,
  });
};

export default useGetDeviceInfoFromGuid;
