import { useEffect, useState } from 'react';
import useIndexedDbData from '../useIndexedDbData/useIndexedDbData.hook';
import { type CurrentUserRightToFrontendAll } from '../useMasterData/masterData.interface';
import { type TimeEntity, type WorkflowDetail } from '../useTourData/tourData.interface';
import { useSelector } from 'react-redux';
import useTechnicianData from '../useTechnicianData/useTechnicianData.hook';
import { isDefined } from '@/src/helpers/genericFunctions';

interface ReturnType {
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
  workflowDetailData: WorkflowDetail | null;
  currentUserRightToFrontendAllsData: CurrentUserRightToFrontendAll[];
}

const useReadOnly = (): ReturnType => {
  const id = useSelector((state: any) => state.serviceOrder.id);

  const { data: technicianData } = useTechnicianData();

  const [readOnly, setReadOnly] = useState(false);
  const [systemUser, setSystemUser] = useState<string>('');

  const { dataItem: workflowDetailData, getDataItem: getWorkflowDetail } =
    useIndexedDbData<WorkflowDetail>('TourPlanData', 'WorkflowDetails');

  const { dataItem: timeEntity, getDataItem: getTimeEntity } = useIndexedDbData<TimeEntity>(
    'TourPlanData',
    'TimeEntities'
  );

  const {
    dataList: currentUserRightToFrontendAllsData,
    getDataList: getCurrentUserRightToFrontendAlls,
  } = useIndexedDbData<CurrentUserRightToFrontendAll>(
    'MasterData',
    'CurrentUserRightToFrontendAlls'
  );

  useEffect(() => {
    getCurrentUserRightToFrontendAlls();
  }, []);

  useEffect(() => {
    if (id) {
      getWorkflowDetail('OrderId', Number(id));
      getTimeEntity('OrderId', Number(id));
    }
  }, [id]);

  useEffect(() => {
    setReadOnly(getReadOnlyStatus());
  }, [id, workflowDetailData, currentUserRightToFrontendAllsData]);

  useEffect(() => {
    if (technicianData?.systemUser) {
      setSystemUser(technicianData.systemUser);
    }
  }, [technicianData]);

  const getReadOnlyStatus = () => {
    if (!isDefined(workflowDetailData) || !isDefined(currentUserRightToFrontendAllsData)) {
      return false;
    }

    const userActiveStatus = currentUserRightToFrontendAllsData.some(
      (it) => it.RightToFrontendUser === '179'
    );

    if (userActiveStatus) {
      return false;
    }

    const isInChoosenTour = isDefined(timeEntity) && timeEntity.TimeId !== 0;

    if (isInChoosenTour) {
      return false;
    }

    const workFLowStatus =
      workflowDetailData &&
      !workflowDetailData?.DoneOn &&
      workflowDetailData?.Processor?.endsWith(systemUser);

    if (isDefined(workFLowStatus) && !workFLowStatus) {
      return true;
    }

    return false;
  };

  return { readOnly, setReadOnly, workflowDetailData, currentUserRightToFrontendAllsData };
};

export default useReadOnly;
