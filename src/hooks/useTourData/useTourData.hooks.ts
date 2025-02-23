import axios from '@/src/configs/axiosConfig';
import environment from '@/environment';
import { storeData } from '@/indexedDb';
import { type ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type TourDataResponse } from './tourData.interface';
import populateUniqueID from '@/src/helpers/injectUniqueID';
import { updateDataModel } from '../useUpdateAPI/updateDataModel';
import { type ITechnicianData } from '../useTechnicianData/interface';
import { emptyTourDataModel } from './emptyTourDataModel';
import appendZToDateStrings from '@/src/helpers/appendZToDateStrings';

const getTourData = async (
  selectedDate: string,
  technicianData: ITechnicianData,
  serviceOrderId: string
) => {
  let url = `${environment.serviceBusiness}/Query/TourData?TechnicianId=${technicianData.technicianId}&TechnicianName=${technicianData.technicianName}&SystemUser=${technicianData.systemUser}&TechnicianEmployeeNumber=${technicianData.technicianEmployeeNumber}`;

  if (serviceOrderId !== '') {
    url += `&SoId=${serviceOrderId}`;
  } else if (selectedDate) url += `&SelectedDate=${selectedDate}`;

  const res = axios.get<ApiResponse<TourDataResponse>>(url);

  const { data } = await res;

  if (data.Data && data.StatusCode === 200 && data.ErrorMessage == null) {
    storeData('TourPlanData', JSON.stringify(appendZToDateStrings(populateUniqueID(data.Data))));
    storeData(
      'UpdatedData',
      JSON.stringify(
        updateDataModel(
          data.Data.SyncDate.SyncId,
          data.Data.SyncDate.SyncDateTime,
          'marior',
          technicianData.technicianId,
          technicianData.technicianEmployeeNumber
        )
      )
    );
    localStorage.removeItem('blockedServiceOrderIds');
    const emptyArray: string[] = [];
    localStorage.setItem('blockedServiceOrderIds', JSON.stringify(emptyArray));

    return data;
  }
  if (data.ErrorMessage) {
    throw new Error(data.ErrorMessage);
  }
  if (data.StatusCode === 200 && data.Message) {
    storeData('TourPlanData', JSON.stringify(populateUniqueID(emptyTourDataModel())));
    return data;
  }
  return null;
};

const useTourData = (
  serviceOrderId: string,
  selectedDate: string,
  isReady: boolean,
  technicianData: ITechnicianData
): UseQueryResult<ApiResponse<TourDataResponse> | null, Error> =>
  useQuery<ApiResponse<TourDataResponse> | null, Error>({
    queryKey: ['tourData', selectedDate, technicianData, serviceOrderId],
    queryFn: async () => await getTourData(selectedDate, technicianData, serviceOrderId),
    enabled: (!!selectedDate || !!serviceOrderId) && isReady && !!technicianData,
  });

export default useTourData;
