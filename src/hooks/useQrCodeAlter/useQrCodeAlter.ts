import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export interface QrCodeAlterPayload {
  SystemUserWithoutDomain: string;
  OldDeviceGuid: string;
  NewDeviceGuid: string;
}

const alterQrCode = async (payload: QrCodeAlterPayload): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/QrCodeAlter`,
    payload
  );

  if (!res) throw new Error();

  const { data } = res;

  if (data.Data && data.StatusCode === 200 && !data.ErrorMessage) {
    return data.Data;
  }

  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }

  return null;
};

const useQrCodeAlter = () => {
  const mutation = useMutation({
    mutationFn: alterQrCode,
  });

  return { submitQrCodeAlter: mutation.mutate };
};

export default useQrCodeAlter;
