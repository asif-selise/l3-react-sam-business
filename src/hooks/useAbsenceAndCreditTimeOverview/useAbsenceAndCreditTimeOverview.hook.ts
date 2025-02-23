import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';
import { type Appointment } from '../useTourData/tourData.interface';

const getAbsenceAndCreditTimeOverview = async (technicianEmployeeNumber: number | null) => {
  const url = `${environment.serviceBusiness}/Query/AbsenceAndCreditTimes?TechnicianEmployeeNumber=${technicianEmployeeNumber}`;

  const res = await axios.get<ApiResponse<Appointment[]>>(url);
  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useAbsenceAndCreditTimeOverview = (
  technicianEmployeeNumber: number | null
): UseQueryResult<Appointment[] | null, Error> => {
  const response = useQuery<Appointment[] | null, Error>({
    queryKey: ['getCheckNumberOfDays', technicianEmployeeNumber],
    queryFn: async () => await getAbsenceAndCreditTimeOverview(technicianEmployeeNumber),
    enabled: !!technicianEmployeeNumber,
  });

  return response;
};

export default useAbsenceAndCreditTimeOverview;
