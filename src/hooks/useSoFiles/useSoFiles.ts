import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type SoFile } from './types';

const getSoFiles = async (SoId: number) => {
  const url = `${environment.serviceBusiness}/Query/SoFiles?SoId=${SoId}`;

  const res = axios.get<ApiResponse<SoFile[]>>(url);
  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useSoFiles = (SoId: number): UseQueryResult<SoFile[] | null, Error> => {
  const response = useQuery<SoFile[] | null, Error>({
    queryKey: ['soFiles', SoId],
    queryFn: async () => await getSoFiles(SoId),
  });

  return response;
};

export default useSoFiles;
