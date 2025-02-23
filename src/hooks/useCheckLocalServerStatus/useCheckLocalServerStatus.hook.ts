import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';

export const checkLocalServerStatus = async (url: string): Promise<boolean> => {
  try {
    const res = await axios.get<ApiResponse<string>>(url);
    const { data } = res;

    return data.StatusCode === 200 && data.ErrorMessage == null;
  } catch {
    return false;
  }
};

const useCheckLocalServerStatus = (url: string): UseQueryResult<boolean, Error> =>
  useQuery<boolean, Error>({
    queryKey: ['checkLocalServerStatus', url],
    queryFn: async () => await checkLocalServerStatus(url),
  });

export default useCheckLocalServerStatus;
