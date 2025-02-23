import environment from '@/environment';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { type IPrintTableData } from '../useMasterData/masterData.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios from '@/src/configs/axiosConfig';

const getURl = (
  tourDate: string,
  technicianEmployeeNumberType: string,
  mANM?: number[],
  branchId?: string
) => {
  let urlWithTeNt = '';
  if (mANM?.length && mANM.length > 0) {
    urlWithTeNt = mANM.map((number) => `TechnicianEmployeeNumber=${number}`).join('&');
  }

  const baseURL = `${environment.serviceBusiness}/Query/SetupInformation?TourDate=${tourDate}&TechnicianEmployeeNumberType=${technicianEmployeeNumberType}`;

  const urlWithBrandId = branchId ? `${baseURL}&BranchId=${branchId}` : baseURL;

  const finalURL = urlWithTeNt ? `${urlWithBrandId}&${urlWithTeNt}` : urlWithBrandId;

  return finalURL;
};
const getPrintTableData = async (
  tourDate: string,
  technicianEmployeeNumberType: string,
  mANM?: number[],
  branchId?: string
) => {
  const url = getURl(tourDate, technicianEmployeeNumberType, mANM, branchId);

  const res = await axios.get<ApiResponse<IPrintTableData>>(url);
  const { data } = res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    return data.Data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  return null;
};

const usePrintTable = (
  tourDate: string,
  technicianEmployeeNumberType: string,
  mANM?: number[],
  branchId?: string
): UseQueryResult<IPrintTableData | null, Error> =>
  useQuery<IPrintTableData | null, Error>({
    queryKey: ['printTableData', tourDate, mANM, technicianEmployeeNumberType, branchId],
    queryFn: async () =>
      await getPrintTableData(tourDate, technicianEmployeeNumberType, mANM, branchId),
    enabled: !!tourDate && !!technicianEmployeeNumberType,
  });

export default usePrintTable;
