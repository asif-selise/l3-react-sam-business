import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export interface DeletePhotoPayload {
  ServiceOrderNo: number;
  ServiceType: string;
  PhotoName: string;
}

const deletePhoto = async (payload: DeletePhotoPayload): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/DeletePhoto`,
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

const useDeletePhoto = () => {
  const mutation = useMutation({
    mutationFn: deletePhoto,
  });

  return { submitDeletePhoto: mutation.mutate };
};

export default useDeletePhoto;
