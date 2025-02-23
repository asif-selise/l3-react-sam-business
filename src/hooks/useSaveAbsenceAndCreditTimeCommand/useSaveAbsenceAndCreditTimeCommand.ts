import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type ISaveAbsenceAndCreditTimeCommand } from './types';

const addAbsenceAndCreditTime = async (
  payload: ISaveAbsenceAndCreditTimeCommand
): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/AbsenceAndCreditTime`,
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

const useSaveAbsenceAndCreditTimeCommand = () => {
  const mutation = useMutation({
    mutationFn: async (payload: ISaveAbsenceAndCreditTimeCommand) => {
      return await addAbsenceAndCreditTime(payload);
    },
  });

  const submitAddAbsenceAndCreditTime = (payload: ISaveAbsenceAndCreditTimeCommand) => {
    mutation.mutate(payload);
  };

  const response = {
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };

  return { submitAddAbsenceAndCreditTime, response };
};

export default useSaveAbsenceAndCreditTimeCommand;
