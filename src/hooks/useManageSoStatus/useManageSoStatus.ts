import { useDispatch, useSelector } from '@/src/redux/store';
import { updateSoStatus, SO_STATUS } from '@/src/slices/soStatusSlice/soStatus.slice';
import { useEffect } from 'react';
import useIndexedDbData from '../useIndexedDbData/useIndexedDbData.hook';
import { type OrderStatus } from '../useMasterData/masterData.interface';
import { type ServiceOrderDetail } from '../useTourData/tourData.interface';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';

const useManageSoStatus = (): void => {
  const dispatch = useDispatch();
  const soId = useSelector((state) => state.serviceOrder.id);
  const { isBlockedServiceOrder } = useAutoSync();

  const { dataItem: soData, getDataItem: getSoData } = useIndexedDbData<ServiceOrderDetail>(
    'TourPlanData',
    'ServiceOrderDetails'
  );

  const { dataItem: orderStatusData, getDataItem: getOrderStatusData } =
    useIndexedDbData<OrderStatus>('MasterData', 'OrderStatusList');

  useEffect(() => {
    if (soId) {
      getSoData('OrderId', soId);
    }
  }, [soId]);

  useEffect(() => {
    if (soData?.Status) {
      getOrderStatusData('Id', soData.Status);
    }
  }, [soData?.Status]);

  useEffect(() => {
    if (!soData || !orderStatusData) return;

    const soId: string = localStorage.getItem('serviceOrderId') ?? '';
    const blockedSo = isBlockedServiceOrder(soId.toString());
    if (blockedSo) {
      dispatch(updateSoStatus({ soStatus: SO_STATUS.ReadOnly }));
      return;
    }

    if (orderStatusData.IsOrderAllowed) {
      if (soData.WorkflowItemRs && soData.WorkflowItemRs !== 15) {
        dispatch(updateSoStatus({ soStatus: SO_STATUS.Modified }));
      } else {
        dispatch(updateSoStatus({ soStatus: SO_STATUS.Default }));
      }
    } else {
      dispatch(updateSoStatus({ soStatus: SO_STATUS.ReadOnly }));
    }
  }, [soData?.WorkflowItemRs, orderStatusData?.IsOrderAllowed]);
};

export default useManageSoStatus;
