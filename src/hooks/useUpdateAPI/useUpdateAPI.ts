import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type UpdateAPIData } from './interface';
import { getData } from '@/indexedDb';
import { type UpdateDataResultDto } from '../useAutoSync/types';

interface ResponseType {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: UpdateDataResultDto | any;
}

interface UpdateCommand {
  UpdateItems: UpdateAPIData[];
}

type ReturnType = [(updateData: UpdateAPIData) => void, ResponseType];

const syncUpdateData = async (updateData: UpdateAPIData): Promise<string | null> => {
  const previousPayloads = (await getData('queuedPayloads')) ?? [];

  const payload: UpdateCommand = {
    UpdateItems: [...previousPayloads, updateData],
  };

  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/Save`,
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

const useUpdateAPI = (): ReturnType => {
  const mutation = useMutation({
    mutationFn: async (updateData: UpdateAPIData) => {
      return await syncUpdateData(updateData);
    },
  });

  const submitUpdate = (updateData: UpdateAPIData) => {
    mutation.mutate(updateData);
  };

  const response: ResponseType = {
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
  };

  return [submitUpdate, response];
};

export default useUpdateAPI;
