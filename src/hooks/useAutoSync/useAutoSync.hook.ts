import { useEffect } from 'react';
import useUpdateAPI from '@/src/hooks/useUpdateAPI/useUpdateAPI';
import type { UpdateAPIData } from '@/src/hooks/useUpdateAPI/interface';
import { getData, setData } from '@/indexedDb';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import { updatePayloadsIndexDb } from '@/src/helpers/updatePayloads';
import { type AutoSyncReturnType } from './types';

const useAutoSync = (): AutoSyncReturnType => {
  const [uploadUpdatedData, uploadResponse] = useUpdateAPI();
  const { resetUpdateData } = useSyncData();

  useEffect(() => {
    if (uploadResponse.isSuccess) {
      updatePayloadsIndexDb(uploadResponse.data);
    }
  }, [uploadResponse]);

  const syncData = async () => {
    const key = 'UpdatedData';
    const updatedData: UpdateAPIData = await getData(key);
    if (!isSyncNeeded(updatedData)) {
      return;
    }

    uploadUpdatedData(updatedData);
    const previousPayload = (await getData('queuedPayloads')) ?? [];
    const payload = [...previousPayload, updatedData];
    await setData('queuedPayloads', payload);

    const blockedServiceOrderIdsString = localStorage.getItem('blockedServiceOrderIds');
    const serviceOrderId = localStorage.getItem('serviceOrderId');
    if (blockedServiceOrderIdsString && serviceOrderId) {
      const blockedServiceOrderIds: string[] = JSON.parse(blockedServiceOrderIdsString);
      blockedServiceOrderIds.push(serviceOrderId);
      localStorage.setItem('blockedServiceOrderIds', JSON.stringify(blockedServiceOrderIds));
    }
    await resetUpdateData();
  };

  const isSyncNeeded = (updatedData: any): boolean => {
    let modified = false;

    for (const key in updatedData) {
      if (typeof updatedData[key] !== 'string') {
        const entity: any = updatedData[key];

        for (const itemKey in entity) {
          if (entity[itemKey].length > 0) {
            modified = true;
            break;
          }
        }
        if (modified) {
          break;
        }
      }
    }
    return modified;
  };

  const syncNeeded = async (): Promise<boolean> => {
    const key = 'UpdatedData';
    const updatedData: UpdateAPIData = await getData(key);
    return isSyncNeeded(updatedData);
  };

  const isBlockedServiceOrder = (serviceOrderId: string): boolean => {
    const blockedServiceOrderIdsString = localStorage.getItem('blockedServiceOrderIds');
    if (blockedServiceOrderIdsString) {
      const blockedServiceOrderIds: string[] = JSON.parse(blockedServiceOrderIdsString);
      return blockedServiceOrderIds.includes(serviceOrderId);
    }
    return false;
  };

  return { syncData, isBlockedServiceOrder, syncNeeded };
};

export default useAutoSync;
