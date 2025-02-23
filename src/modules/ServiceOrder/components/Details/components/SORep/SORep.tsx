import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { type TableData } from '@/src/components/CustomTable/types';
import SORepTable from './components/SORepTable/SORepTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ServiceOrderDetail, type Offer } from '@/src/hooks/useTourData/tourData.interface';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import { SO_STATUS, updateSoStatus } from '@/src/slices/soStatusSlice/soStatus.slice';
import { updateServiceOrderState } from '@/src/slices/serviceOrderSlice/serviceOrder.slice';

const SORep = () => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);
  const dispatch = useDispatch();
  const { syncData, syncNeeded } = useAutoSync();
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
  const [openApartmentIdNotFoundConfirmationModal, setOpenApartmentIdNotFoundConfirmationModal] =
    useState<boolean>(false);
  const {
    dataItem: serviceOrderData,
    getDataItem: getServiceOrderData,
    getDataItemAsync: getSoDataAsync,
  } = useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');
  const { resetUpdateData } = useSyncData();

  const {
    filteredDataList: offerList,
    getFilteredDataList: getOfferList,
    isLoading,
  } = useIndexedDbData<Offer>('TourPlanData', 'Offers');

  useEffect(() => {
    if (id) {
      getServiceOrderData('OrderId', Number(id));
    }
  }, [id]);

  useEffect(() => {
    getOfferList('SORep', serviceOrderData?.SO_Rep ?? null);
  }, [serviceOrderData]);

  const onSORepTableRowClick = async (row: TableData) => {
    setSelectedRow(row);

    const syncTrue = await syncNeeded();
    if (syncTrue) {
      const modifiedServiceOrderData = await getSoDataAsync('OrderId', id);
      if (
        modifiedServiceOrderData.ObjectApartmentId === '00000000-0000-0000-0000-000000000000' ||
        modifiedServiceOrderData.ObjectApartmentId === null ||
        modifiedServiceOrderData.ObjectApartmentId === ''
      ) {
        setOpenApartmentIdNotFoundConfirmationModal(true);
        return;
      }
      setOpenConfirmationModal(true);
    } else {
      navigateToServiceOrder(row);
    }
  };

  const navigateToServiceOrder = (row: TableData | null = null) => {
    if (row == null) return;
    localStorage.setItem('serviceOrderId', row?.SpecialOffer as string);
    dispatch(updateSoStatus({ offerServiceOrder: true, soStatus: SO_STATUS.ReadOnly }));
    dispatch(updateServiceOrderState(parseInt(row?.SpecialOffer as string)));
    setSelectedRow(null);
  };

  return (
    <Box
      aria-label="SORep"
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
      }}
    >
      <Typography p={'24px'} variant="h6" color={'text.primary'}>
        {t('ANGEBOTE_SO_REP')}
      </Typography>
      <SORepTable
        data={offerList as unknown as TableData[]}
        isLoading={isLoading}
        onSORepTableRowClick={onSORepTableRowClick}
      />
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('ARE_YOU_SURE_YOU_WANT_OPEN_SERVICE_ORDER', {
            serviceOrder: selectedRow?.SpecialOffer,
          })}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: async () => {
              await syncData();
              navigateToServiceOrder(selectedRow);
              setOpenConfirmationModal(false);
            },
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
      {openApartmentIdNotFoundConfirmationModal && (
        <ConfirmationModal
          open={openApartmentIdNotFoundConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('ERROR_MSG_APPARTMENT_ID_NOT_FOUND')}
          discardButton={{
            title: t('DISCARD_CHANGES_AND_OPEN_OFFER_SO'),
            variant: 'contained',
            color: 'error',
            action: async () => {
              await resetUpdateData();
              setOpenApartmentIdNotFoundConfirmationModal(false);
              navigateToServiceOrder(selectedRow);
            },
          }}
          primaryActionButton={{
            title: t('CONTINUE_EDITING'),
            actionId: '',
            action: () => {
              setOpenApartmentIdNotFoundConfirmationModal(false);
            },
          }}
        />
      )}
    </Box>
  );
};

export default SORep;
