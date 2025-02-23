import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getData } from '@/indexedDb';
import { type TechnicianInfo } from '@/src/components/Login/type';

interface technicianDataResponse {
  technicianId: number;
  technicianEmployeeNumber: number;
  technicianName: string;
  systemUser: string;
  fullName: string;
}

const getTechnicianData = async (): Promise<technicianDataResponse> => {
  const key = 'technicianData';
  const technicianData: TechnicianInfo = await getData(key);
  return {
    technicianId: technicianData.TechnicianId,
    technicianEmployeeNumber: technicianData.TechnicianEmployeeNumber,
    technicianName: technicianData.TechnicianName,
    systemUser: technicianData.SystemUserName,
    fullName: technicianData.TechnicianName,
  };
};

const useTechnicianData = (): UseQueryResult<technicianDataResponse | null, Error> =>
  useQuery<technicianDataResponse | null, Error>({
    queryKey: ['technicianData'],
    queryFn: getTechnicianData,
  });

export default useTechnicianData;
