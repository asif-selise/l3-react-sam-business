import { getData, setData, storeData } from '@/indexedDb';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import Iconify from '@/src/components/iconify/iconify';
import StickyContainer from '@/src/components/StickyContainer/StickyContainer';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import lightColorPalette from '@/src/hooks/useCustomTheme/colors/lightColorPalette';
import useNetworkStatus from '@/src/hooks/useNetworkStatus/useNetworkStatus';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import { type UpdateAPIData } from '@/src/hooks/useUpdateAPI/interface';
import { showWarningMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { updateSyncStatus } from '@/src/slices/syncSlice/sync.slice';
import { Box, Button, Card } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { JSONTree } from 'react-json-tree';
import { useDispatch, useSelector } from 'react-redux';
import { type MaintenanceModalType } from './types';
import { updateDataModel } from '@/src/hooks/useUpdateAPI/updateDataModel';
import { v4 as uuidv4 } from 'uuid';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';

const Maintenance = () => {
  const { t } = useTranslation('index');
  const [updateData, setUpdateData] = useState<UpdateAPIData | any>({});
  const [queuedData, setQueuedData] = useState<UpdateAPIData[]>([]);
  const [failedData, setFailedData] = useState<UpdateAPIData[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { checkOnlineStatus } = useNetworkStatus();
  const dispatch = useDispatch();
  const { handleConnection, uploadResponse } = useSyncData();
  const { sync: syncState } = useSelector((state: any) => state.sync);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [confirmationModalType, setConfirmationModalType] = useState<MaintenanceModalType>('');
  const [confirmationModalDetail, setConfirmationModalDetail] = useState<string>('');
  const { data: technicianData } = useTechnicianData();

  const fetchUpdateData = async () => {
    const allUpdatedData = await getData('UpdatedData');
    const allQueuedData: UpdateAPIData[] = (await getData('queuedPayloads')) ?? [];
    const allFailedData: UpdateAPIData[] = (await getData('failedPayloads')) ?? [];

    setUpdateData(allUpdatedData as UpdateAPIData);
    setQueuedData(allQueuedData);
    setFailedData(allFailedData);
  };

  const setUpdateApiData = async (payload: UpdateAPIData | null) => {
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
    if (payload) await setData('UpdatedData', payload);
  };

  useEffect(() => {
    fetchUpdateData();
  }, []);

  const handleExportData = (data: any) => {
    if (!data) {
      alert(t('No data to export'));
    }

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'maintenance_data.json';
    link.click();
  };

  const handleOpenModal = (modalType: MaintenanceModalType) => {
    setOpenConfirmationModal(true);
    setConfirmationModalType(modalType);
    if (modalType === 'import') {
      setConfirmationModalDetail(t('IMPORT_DATA_CONFIRMATION'));
    } else if (modalType === 'clear-failed') {
      setConfirmationModalDetail(t('CLEAR_FAILED_PAYLOAD_CONFIRMATION'));
    } else if (modalType === 'clear') {
      setConfirmationModalDetail(t('CLEAR_CURRENT_CHANGES_CONFIRMATION'));
    } else {
      setConfirmationModalDetail(t('SYNCHRONIZE_CONFIRMATION'));
    }
  };

  const handleModalAction = async () => {
    setOpenConfirmationModal(false);

    if (confirmationModalType === 'import') {
      fileInputRef.current?.click();
    } else if (confirmationModalType === 'clear-failed') {
      setFailedData([]);
    } else if (confirmationModalType === 'clear') {
      const tourData = await getData('TourPlanData');
      setUpdateData(
        updateDataModel(
          uuidv4(),
          tourData ? (tourData.SyncDate?.SyncDateTime as string) : '',
          technicianData?.systemUser ?? '',
          technicianData?.technicianId,
          technicianData?.technicianEmployeeNumber
        )
      );
      setUpdateApiData(null);
    } else if (confirmationModalType === 'sync') {
      executeSync();
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      alert(t('NO_FILE_SELECTED'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        // setUpdateData(jsonData as UpdateAPIData);
        // setUpdateApiData(jsonData as UpdateAPIData);
        const queuedPayloads: UpdateAPIData[] = (await getData('queuedPayloads')) ?? [];
        if (jsonData.length > 0) {
          const newQueudPayload: UpdateAPIData[] = [...queuedPayloads, ...jsonData];
          await setData('queuedPayloads', newQueudPayload);
          setQueuedData(newQueudPayload);
        }
      } catch (error) {
        alert(t('INVALID_JSON_FILE'));
      }
    };
    reader.onerror = () => {
      alert(t('ERROR_READING_FILE'));
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  useEffect(() => {
    if (syncState.status === 'downloaded') {
      setTimeout(() => {
        fetchUpdateData();
      }, 1000);
    }
  }, [syncState.status]);

  useEffect(() => {
    if (uploadResponse.isSuccess) {
      dispatch(updateSyncStatus({ loading: false, status: 'downloaded' }));
    }
  }, [uploadResponse.isSuccess]);

  const executeSync = async () => {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
      dispatch(showWarningMessage(t('APP_IS_OFFLINE')));
      return;
    }
    handleConnection();
  };

  return (
    <>
      <StickyContainer>
        <CustomBreadcrumbs heading={t('MAINTENANCE')} links={[{ name: t('MAINTENANCE') }]} />
      </StickyContainer>
      <Card>
        <Box sx={{ p: 3 }}>
          <Box sx={{ pb: 3 }} display={'flex'} justifyContent={'flex-end'} columnGap={3}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleOpenModal('sync');
              }}
              disabled={!syncState.online}
              startIcon={<Iconify width={16} icon="material-symbols:cloud-sync" />}
            >
              {t('index:SYNCHRONIZE')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<Iconify width={16} icon="uil:import" />}
              onClick={() => {
                handleOpenModal('import');
              }}
            >
              {t('IMPORT')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportData}
            />
            <Button
              color="primary"
              variant="outlined"
              startIcon={<Iconify width={16} icon="uil:export" />}
              onClick={() => {
                handleExportData(updateData);
              }}
            >
              {t('Export')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<Iconify width={16} icon="uil:export" />}
              onClick={() => {
                handleExportData(failedData);
              }}
            >
              {t('EXPORT_FAILED_PAYLOAD')}
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => {
                handleOpenModal('clear');
              }}
            >
              {t('DELETE_PAYLOAD')}
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => {
                handleOpenModal('clear-failed');
              }}
            >
              {t('DELETE_FAILED_PAYLOAD')}
            </Button>
          </Box>

          <Box sx={{ py: 1, px: 2, backgroundColor: COMMON.grey[300], borderRadius: 2 }}>
            {/* <JSONTree
              data={{
                CurrentChanges: updateData,
                QueuedPayloads: queuedData,
                FailedPayloads: failedData,
              }}
              theme={{
                base0D: lightColorPalette.primary.main,
                base00: COMMON.grey[300],
              }}
            /> */}
          </Box>
        </Box>
      </Card>
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={confirmationModalDetail}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: handleModalAction,
          }}
          discardButton={{
            title: t('NO'),
            variant: 'contained',
            action: () => {
              setOpenConfirmationModal(false);
            },
          }}
        />
      )}
    </>
  );
};

export default Maintenance;
