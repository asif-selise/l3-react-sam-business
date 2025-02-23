import { useMutation } from '@tanstack/react-query';
import type { UpdateSamOrderPayload } from './interface';
import environment from '@/environment';
import axios from '@/src/configs/axiosConfig';
import type { ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export const updateSamOrder = async (payload: UpdateSamOrderPayload): Promise<string | null> => {
  const url = `${environment.serviceBusiness}/Command/UpdateSamOrder`;
  const res = await axios.post<ApiResponse<string | null>>(url, payload);

  const { data } = res;

  if (data.Data && data.StatusCode === 200 && !data.ErrorMessage) {
    return data.Data;
  }

  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }

  return null;
};

const useUpdateSamOrder = () => {
  const mutation = useMutation({
    mutationFn: async (payload: UpdateSamOrderPayload) => {
      return await updateSamOrder(payload);
    },
  });

  const submitUpdate = (updateData: UpdateSamOrderPayload) => {
    mutation.mutate(updateData);
  };

  const response = {
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error?.message,
  };

  return { submitUpdate, response };
};

export default useUpdateSamOrder;
