import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';

const getWarehouseStockTurnoverReport = async (
  fromDate: string,
  toDate: string,
  technicianEmployeeNumber: number | null
) => {
  const url = `${environment.serviceBusiness}/Query/WarehouseStockTurnoverReport?From=${fromDate}&To=${toDate}&TechnicianEmployeeNumber=${technicianEmployeeNumber}`;

  const res = await axios.get<ApiResponse<string>>(url);
  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const useWarehouseStockTurnoverReport = (
  fromDate: string,
  toDate: string,
  technicianEmployeeNumber: number | null
): UseQueryResult<string | null, Error> => {
  const response = useQuery<string | null, Error>({
    queryKey: ['getWarehouseStockTurnoverReport', fromDate, toDate, technicianEmployeeNumber],
    queryFn: async () =>
      await getWarehouseStockTurnoverReport(fromDate, toDate, technicianEmployeeNumber),
    enabled: false,
  });

  return response;
};

export default useWarehouseStockTurnoverReport;
