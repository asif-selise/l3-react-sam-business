import environment from '@/environment';
import { storeData } from '@/indexedDb';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type MasterData } from './masterData.interface';

export interface Manufacturers {
  Id: number;
  Name: string;
}

const getMasterData = async () => {
  const res = axios.get<ApiResponse<MasterData>>(`${environment.serviceBusiness}/Query/masterdata`);
  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    storeData('MasterData', JSON.stringify(data.Data));
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useMasterData = (): UseQueryResult<MasterData | null, Error> =>
  useQuery<MasterData | null, Error>({
    queryKey: ['masterData'],
    queryFn: getMasterData,
  });

export default useMasterData;
