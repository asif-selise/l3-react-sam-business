import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export interface SavePhotoPayload {
  ServiceOrderNo: number;
  LoginUserName: string;
  Base64Image: string;
  ServiceType: string;
  WoodOrderDetailId?: number;
  TechnicianNumber?: number;
  Remarks: string;
  SortOrder: number;
}

const savePhoto = async (payload: SavePhotoPayload): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/SavePhoto`,
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

const useSavePhoto = () => {
  const mutation = useMutation({
    mutationFn: savePhoto,
  });

  return { submitSavePhoto: mutation.mutate };
};

export default useSavePhoto;
