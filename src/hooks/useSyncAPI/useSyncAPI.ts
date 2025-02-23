import { useDispatch } from '@/src/redux/store';
import { updateSyncStatus } from '@/src/slices/syncSlice/sync.slice';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getFormattedCurrentTime } from '@/src/components/NavigationBar/Topbar/components/ConnectionPopover/utils/formatDate';
import { getData, storeData } from '@/indexedDb';
import { type UpdateAPIData } from '../useUpdateAPI/interface';
import useUpdateAPI from '../useUpdateAPI/useUpdateAPI';
import { updateDataModel } from '../useUpdateAPI/updateDataModel';
import { v4 as uuidv4 } from 'uuid';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { updatePayloadsIndexDb } from '@/src/helpers/updatePayloads';

const useSyncData = () => {
  const [lastSyncTime, setLastSyncTime] = useState(getFormattedCurrentTime(new Date()));
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [uploadUpdatedData, uploadResponse] = useUpdateAPI();
  const { data: technicianData } = useTechnicianData();

  const handleConnection = async () => {
    dispatch(updateSyncStatus({ loading: true, status: 'uploading' }));

    const updatedData: UpdateAPIData = await getData('UpdatedData');
    uploadUpdatedData(updatedData);
  };

  useEffect(() => {
    if (uploadResponse.isSuccess) {
      updatePayloadsIndexDb(uploadResponse.data);
    }
  }, [uploadResponse]);

  const resetUpdateData = async (id = '') => {
    const tourData = await getData('TourPlanData');
    storeData(
      'UpdatedData',
      JSON.stringify(
        updateDataModel(
          uuidv4(),
          tourData ? (tourData.SyncDate?.SyncDateTime as string) : '',
          technicianData?.systemUser ?? '',
          technicianData?.technicianId,
          technicianData?.technicianEmployeeNumber
        )
      )
    );
  };

  const downloadData = () => {
    const selectedDate = localStorage.getItem('date');
    if (selectedDate) {
      const date = JSON.parse(selectedDate);
      queryClient.invalidateQueries({ queryKey: ['tourData', date] });
    }
    dispatch(updateSyncStatus({ loading: true, status: 'downloading' }));
  };

  useEffect(() => {
    if (uploadResponse.isSuccess) {
      resetUpdateData();
      setLastSyncTime(getFormattedCurrentTime(new Date()));
      downloadData();
    }
  }, [uploadResponse.isSuccess]);

  useEffect(() => {
    if (uploadResponse.isError) {
      dispatch(updateSyncStatus({ loading: false, status: 'downloaded' }));
      downloadData();
    }
  }, [uploadResponse.isError]);

  return {
    handleConnection,
    lastSyncTime,
    setLastSyncTime,
    uploadResponse,
    resetUpdateData,
  };
};

export default useSyncData;
