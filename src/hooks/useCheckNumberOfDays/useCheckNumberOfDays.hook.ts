import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import {
  type CheckNumberOfDaysQueryFields,
  type ICheckNumberOfDaysData,
} from '@/src/modules/DataMenu/components/ReportSection/components/AddAbsenceReport/interfaces';

const getCheckNumberOfDays = async (query: CheckNumberOfDaysQueryFields) => {
  let url = `${environment.serviceBusiness}/Query/CheckNumberOfDays?TechnicianEmployeeNumber=${query.TechnicianEmployeeNumber}&FromDateDayPart=${query.FromDateDayPart}&ToDateDayPart=${query.ToDateDayPart}`;

  if (query?.FromDate) url += `&FromDate=${query.FromDate}`;
  if (query?.ToDate) url += `&ToDate=${query.ToDate}`;
  if (query?.CountDays) url += `&CountDays=${query.CountDays}`;

  const res = await axios.get<ApiResponse<ICheckNumberOfDaysData>>(url);
  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useCheckNumberOfDays = (
  query: CheckNumberOfDaysQueryFields
): UseQueryResult<ICheckNumberOfDaysData | null, Error> => {
  const response = useQuery<ICheckNumberOfDaysData | null, Error>({
    queryKey: ['getCheckNumberOfDays', query],
    queryFn: async () => await getCheckNumberOfDays(query),
    enabled: true,
  });

  return response;
};

export default useCheckNumberOfDays;
