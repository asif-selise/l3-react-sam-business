import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type ITourSheetAndArpDatesData } from '@/src/modules/DataMenu/components/InfoSection/components/TourSheetAndArpDates/interfaces';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';

const getTourSheetAndArpAppointments = async (
  fromDate: string,
  toDate: string,
  technicianId: number | null
) => {
  const url = `${environment.serviceBusiness}/Query/TourSheetAndArpAppointments?From=${fromDate}&To=${toDate}&TechnicianId=${technicianId}`;

  const res = await axios.get<ApiResponse<ITourSheetAndArpDatesData[]>>(url);
  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useTourSheetAndArpAppointments = (
  fromDate: string,
  toDate: string,
  technicianId: number | null
): UseQueryResult<ITourSheetAndArpDatesData[] | null, Error> => {
  const response = useQuery<ITourSheetAndArpDatesData[] | null, Error>({
    queryKey: ['getTourSheetAndArpAppointments', fromDate, toDate, technicianId],
    queryFn: async () => await getTourSheetAndArpAppointments(fromDate, toDate, technicianId),
    enabled: false,
  });

  return response;
};

export default useTourSheetAndArpAppointments;
