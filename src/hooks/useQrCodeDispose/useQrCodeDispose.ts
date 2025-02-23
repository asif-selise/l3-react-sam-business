import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { useMutation } from '@tanstack/react-query';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';

export interface QrCodeDisposePayload {
  SystemUserWithoutDomain: string;
  DeviceGuid: string;
}

const disposeQrCode = async (payload: QrCodeDisposePayload): Promise<string | null> => {
  const res = await axios.post<ApiResponse<string | null>>(
    `${environment.serviceBusiness}/Command/QrCodeDispose`,
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

const useQrCodeDispose = () => {
  const mutation = useMutation({
    mutationFn: disposeQrCode,
  });

  return { submitQrCodeDispose: mutation.mutate };
};

export default useQrCodeDispose;
