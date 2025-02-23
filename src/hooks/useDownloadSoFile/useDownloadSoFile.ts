import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type SoFile } from '../useSoFiles/types';
import { downloadFile } from '@/src/helpers/downloadFile';

const downloadSoFile = async (soId: number, fileName: string) => {
  const url = `${environment.serviceBusiness}/Query/DownloadSoFile?SoId=${soId}&FileName=${fileName}`;

  const res = axios.get<ApiResponse<string>>(url);
  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useDownloadSoFile = (
  soId: number,
  selectedSoFiles: SoFile[]
): UseQueryResult<number, Error> => {
  const response = useQuery<number, Error>({
    queryKey: ['downloadSoFile', soId, selectedSoFiles],
    queryFn: async () => {
      let successCount = 0;

      for (const selectedSoFile of selectedSoFiles) {
        const data = await downloadSoFile(soId, selectedSoFile.Name);
        if (data) {
          await downloadFile(data, selectedSoFile.Name);
          successCount += 1;
        }
      }

      return successCount;
    },
    enabled: false,
  });

  return response;
};

export default useDownloadSoFile;
