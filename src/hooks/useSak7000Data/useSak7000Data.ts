import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type ISak7000FilterFields } from '@/src/modules/Sak7000/types';
import { type ISak7000DataResponse } from './types';

const getSak7000Data = async (sak7000Data: ISak7000FilterFields) => {
  const { TopRecordNumber, RsLine, Avor, SearchMode, Filter } = sak7000Data;

  const params = [
    TopRecordNumber ? `TopRecordNumber=${encodeURIComponent(TopRecordNumber)}` : '',
    RsLine ? `RsLine=${encodeURIComponent(RsLine)}` : '',
    Avor ? `Avor=${encodeURIComponent(Avor)}` : '',
    SearchMode ? `SearchMode=${encodeURIComponent(SearchMode)}` : '',
    Filter ? `Filter=${encodeURIComponent(Filter)}` : '',
  ];

  const queryString = params.filter(Boolean).join('&');

  const url = `${environment.serviceBusiness}/Query/Sak7000Data?${queryString}`;
  const { data } = await axios.get<ApiResponse<ISak7000DataResponse[]>>(url);

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useSak7000Data = (
  rslineFilterFields: ISak7000FilterFields
): UseQueryResult<ISak7000DataResponse[] | null, Error> => {
  const response = useQuery<ISak7000DataResponse[] | null, Error>({
    queryKey: [
      'dataMenuSamOrders',
      rslineFilterFields.TopRecordNumber,
      rslineFilterFields.RsLine,
      rslineFilterFields.Avor,
      rslineFilterFields.SearchMode,
      rslineFilterFields.Filter,
    ],
    queryFn: async () => await getSak7000Data(rslineFilterFields),
  });

  return response;
};

export default useSak7000Data;
