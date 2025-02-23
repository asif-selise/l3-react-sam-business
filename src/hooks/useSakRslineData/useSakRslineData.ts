import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type IRsLineFilterFields } from '@/src/modules/Sak7000/types';
import { type ISakRsLineDataResponse } from './types';

const getSakRslineData = async (sakRslineData: IRsLineFilterFields) => {
  const {
    Challenge,
    FromDate,
    ToDate,
    Remarks,
    DoneBy,
    ProductGroupNo,
    OrderNo,
    ManufacturerNo,
    RslineId,
  } = sakRslineData;

  const params = [
    Challenge ? `Challenge=${encodeURIComponent(Challenge)}` : '',
    FromDate ? `FromDate=${encodeURIComponent(FromDate)}` : '',
    ToDate ? `ToDate=${encodeURIComponent(ToDate)}` : '',
    Remarks ? `Remarks=${encodeURIComponent(Remarks)}` : '',
    DoneBy ? `DoneBy=${encodeURIComponent(DoneBy)}` : '',
    ProductGroupNo ? `ProductGroupNo=${encodeURIComponent(ProductGroupNo)}` : '',
    OrderNo ? `OrderNo=${encodeURIComponent(OrderNo)}` : '',
    ManufacturerNo ? `ManufacturerNo=${encodeURIComponent(ManufacturerNo)}` : '',
    RslineId ? `RslineId=${encodeURIComponent(RslineId)}` : '',
  ];

  const queryString = params.filter(Boolean).join('&');

  const url = `${environment.serviceBusiness}/Query/SakRslineData?${queryString}`;
  const { data } = await axios.get<ApiResponse<ISakRsLineDataResponse[]>>(url);

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useSakRslineData = (
  rslineFilterFields: IRsLineFilterFields
): UseQueryResult<ISakRsLineDataResponse[] | null, Error> => {
  const response = useQuery<ISakRsLineDataResponse[] | null, Error>({
    queryKey: [
      'dataMenuSamOrders',
      rslineFilterFields.FromDate,
      rslineFilterFields.ToDate,
      rslineFilterFields.Remarks,
      rslineFilterFields.DoneBy,
      rslineFilterFields.ProductGroupNo,
      rslineFilterFields.OrderNo,
      rslineFilterFields.ManufacturerNo,
      rslineFilterFields.RslineId,
    ],
    queryFn: async () => await getSakRslineData(rslineFilterFields),
  });

  return response;
};

export default useSakRslineData;
