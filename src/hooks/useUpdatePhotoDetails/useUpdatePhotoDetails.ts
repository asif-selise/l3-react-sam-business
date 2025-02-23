import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export interface UpdatePhotoPayload {
  ServiceOrderNo: number;
  ServiceType: string;
  PhotoName: string;
  LoginUserName: string;
  TechnicianNumber?: number;
  Remarks: string;
  SortOrder: number;
}

const updatePhotoDetails = async (payload: UpdatePhotoPayload): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/UpdatePhotoDetails`,
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

const useUpdatePhotoDetails = () => {
  const mutation = useMutation({
    mutationFn: updatePhotoDetails,
  });

  return { submitUpdatePhotoDetails: mutation.mutate };
};

export default useUpdatePhotoDetails;
