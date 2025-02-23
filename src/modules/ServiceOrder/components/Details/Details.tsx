import { Alert, Box, Typography } from '@mui/material';
import ServiceOrderDetails from './components/ServiceOrderDetails/ServiceOrderDetails';
import PersonalExpenses from './components/PersonalExpenses/PersonalExpenses';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import DeviceDetails from './components/DeviceDetails/DeviceDetails';
import ServiceOrderArticle from './components/ServiceOrderArticle/ServiceOrderArticle';
import ActionTile from '@/src/components/ActionTile/ActionTile';
import mailIcon from '../../../../../public/assets/icons/ic_mail.svg';
import fileIcon from '../../../../../public/assets/icons/ic_invoice.svg';
import { useTranslation } from 'react-i18next';
import ArticleUsageOrdering from './components/ArticleUsageOrdering/ArticleUsageOrdering';
import SORep from './components/SORep/SORep';
import Message from './components/Message/Message';
import ExpenseCalculator from './components/ExpenseCalculator/ExpenseCalculator';
import Offer from './components/Offer/Offer';
import KVEstimatedCost from './KVEstimatedCost/KVEstimatedCost';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/src/redux/store';
import { SO_STATUS } from '@/src/slices/soStatusSlice/soStatus.slice';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type WoodOrder,
  type PersonalEffort,
  type SamKv,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import dayjs from 'dayjs';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import { getMaxStartDay } from '@/src/modules/ServiceOrder/components/Details/KVEstimatedCost/utils/helpers';
import WoodOrderModal from './components/WoodOrderModal/WoodOrderModal';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';
import { convertToUtcDateTime, getUtcToday } from '@/src/helpers/formatDateByLuxon';

export interface StatusInfo {
  severity: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface Props {
  statusChangeCallback: (status: number | null) => void;
  setDetailsPageDataLoaded: any;
}

const Details = ({ statusChangeCallback, setDetailsPageDataLoaded }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const soId = useSelector((state) => state.serviceOrder.id);
  const { soStatus } = useSelector((state) => state.soStatus);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [isItNewKv, setIsItNewKv] = useState(true);
  const [openKvModal, setOpenKvModal] = useState(false);
  const [openKvCreateConfirmModal, setOpenKvCreateConfirmModal] = useState(false);
  const [openCreateOfferModal, setOpenCreateOfferModal] = useState(false);
  const [openOfferWoodOrderConfirmModal, setOpenOfferWoodOrderConfirmModal] = useState(false);
  const [openWoodOrderModal, setOpenWoodOrderModal] = useState(false);
  const [personalEffortsData, setPersonalEffortsData] = useState<PersonalEffort[] | null>(null);
  const [samOfferUId, setSamOfferUId] = useState<string>('');
  const [samOfferId, setSamOfferId] = useState<number>(0);
  const [isCopyOffer, setIsCopyOffer] = useState(false);
  const [openOfferForCopy, setOpenOfferForCopy] = useState(false);

  const [serviceOrderDetailsLoaded, setServiceOrderDetailsLoaded] = useState(false);
  const [customerDetailsLoaded, setCustomerDetailsLoaded] = useState(false);
  const [deviceDetailsLoaded, setDeviceDetailsLoaded] = useState(false);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>();

  const [dataLoaded, setDataLoaded] = useState(false);
  const { isBlockedServiceOrder } = useAutoSync();

  const getStatusInfo = (status: string | null): StatusInfo => {
    const soIdString = soId.toString();
    const blockedSo = isBlockedServiceOrder(soIdString);
    if (blockedSo) {
      return { severity: 'error', message: t('LOCKED_SERVICE_ORDER') };
    }

    switch (status) {
      case SO_STATUS.Modified:
        return { severity: 'warning', message: t('SO_ORDER_MODIFIED_MESSAGE') };
      case SO_STATUS.ReadOnly:
        return { severity: 'error', message: t('SO_ORDER_READ_ONLY_MESSAGE') };
      default:
        return { severity: 'success', message: t('SO_ORDER_DEFAULT_MESSAGE') };
    }
  };

  const {
    dataItem: sODetailsData,
    getDataItem: getSODetailsData,
    dataList: soDetailsList,
    getDataList: getSODetailsList,
    updateDataLists: updateSODataList,
    isLoading: isLoadingServiceOrderDetails,
  } = useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  const {
    dataList: allPersonalEffortsData,
    getDataList: getAllPersonalEffortsData,
    isLoading: isLoadingPersonalEfforts,
  } = useIndexedDbData<PersonalEffort>('TourPlanData', 'PersonalEfforts');

  const {
    dataItem: samKv,
    getDataItem: getSamKv,
    isLoading: isLoadingSamKvs,
  } = useIndexedDbData<SamKv>('TourPlanData', 'SamKvs');

  const {
    filteredDataList: woodOrderList,
    getFilteredDataList: getWoodOrderList,
    isLoading: isLoadingWoodOrders,
  } = useIndexedDbData<WoodOrder>('TourPlanData', 'WoodOrders');

  useEffect(() => {
    getAllPersonalEffortsData().then();
  }, []);

  useEffect(() => {
    setPersonalEffortsData(allPersonalEffortsData.filter((it) => it.OrderId === soId));
  }, [allPersonalEffortsData]);

  useEffect(() => {
    getSODetailsData('OrderId', soId);
    getWoodOrderList('OrderId', soId);
  }, [soId]);

  useEffect(() => {
    if (sODetailsData?.SO_Rep) {
      getSamKv('OrderId', sODetailsData.SO_Rep);
    }
  }, [sODetailsData]);

  useEffect(() => {
    if (samKv) {
      setIsItNewKv(false);
    }
  }, [samKv]);

  useEffect(() => {
    if (soStatus && dataLoaded) {
      setStatusInfo(getStatusInfo(soStatus));
    }
  }, [soStatus, dataLoaded]);

  const handleKvModalClose = () => {
    setOpenKvModal(false);
  };

  const isMaxStartTodayDateTime = () => {
    const maxStartDay = getMaxStartDay(personalEffortsData ?? []);
    return maxStartDay < convertToUtcDateTime(getUtcToday());
  };

  const handleOpenKvModal = () => {
    if (!isItNewKv) {
      setOpenKvModal(true);
    } else {
      if (isSoReadOnly) {
        dispatch(showErrorMessage(t('CANNOT_CREATE_NEW_KV_LOCKED_SO')));
      } else if (sODetailsData?.Group?.toUpperCase() !== 'S') {
        dispatch(showErrorMessage(t('CANNOT_CREATE_NEW_KV_NO_GROUP_S')));
      } else if (isMaxStartTodayDateTime()) {
        dispatch(
          showErrorMessage(
            t('CANNOT_CREATE_NEW_KV_NO_START_TIME', { time: dayjs().format('HH:mm') })
          )
        );
      } else {
        setOpenKvCreateConfirmModal(true);
      }
    }
  };

  const handleOpenOfferModal = () => {
    if (isSoReadOnly) {
      dispatch(showErrorMessage(t('CANNOT_CREATE_NEW_OFFER')));
      return;
    }
    setSamOfferUId(getUniqueID());
    setSamOfferId(getUniqueNumber());

    if (woodOrderList.length === 0) {
      setOpenCreateOfferModal(true);
    } else {
      setOpenOfferWoodOrderConfirmModal(true);
    }
  };

  const handleWoodOrderModal = (samOfferCopyId: number, samOfferCopyUId: string) => {
    if (woodOrderList.length > 0) {
      setSamOfferId(samOfferCopyId);
      setSamOfferUId(samOfferCopyUId);

      setIsCopyOffer(true);
      setOpenOfferWoodOrderConfirmModal(true);
    } else {
      setOpenOfferForCopy(true);
    }
  };

  useEffect(() => {
    const areAllDataLoaded =
      !isLoadingServiceOrderDetails &&
      !isLoadingPersonalEfforts &&
      !isLoadingSamKvs &&
      !isLoadingWoodOrders &&
      serviceOrderDetailsLoaded &&
      customerDetailsLoaded &&
      deviceDetailsLoaded;

    if (areAllDataLoaded) {
      setDataLoaded(true);
      setDetailsPageDataLoaded(true);
    }
  }, [
    isLoadingServiceOrderDetails,
    isLoadingPersonalEfforts,
    isLoadingSamKvs,
    isLoadingWoodOrders,
    serviceOrderDetailsLoaded,
    customerDetailsLoaded,
    deviceDetailsLoaded,
  ]);

  return (
    <>
      {
        <>
          {(!soStatus || !dataLoaded) && <LoaderOverlay />}
          {soStatus && dataLoaded && statusInfo && (
            <Alert severity={statusInfo.severity} variant="filled">
              {statusInfo.message}
            </Alert>
          )}
          <Box
            display="flex"
            flexDirection={{ tablet: 'column', desktop: 'row' }}
            justifyContent="space-between"
            rowGap={4}
            mt={4}
          >
            <Box width={{ tablet: '100%', desktop: '49.2%' }}>
              <ServiceOrderDetails
                serviceOrderData={sODetailsData}
                getServiceOrderData={getSODetailsData}
                setServiceOrderDetailsLoaded={setServiceOrderDetailsLoaded}
              />
            </Box>
            <Box width={{ tablet: '100%', desktop: '49.2%' }}>
              <CustomerDetails
                customerDetailsData={sODetailsData}
                getCustomerDetailsData={getSODetailsData}
                soDetailsList={soDetailsList}
                getSODetailsList={getSODetailsList}
                updateCustomerDataList={updateSODataList}
                setCustomerDetailsLoaded={setCustomerDetailsLoaded}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection={{ tablet: 'column', desktop: 'row' }}
            justifyContent="space-between"
            rowGap={4}
            mt={4}
          >
            <Box width={{ tablet: '100%', desktop: '49.2%' }}>
              <DeviceDetails
                deviceData={sODetailsData}
                getDeviceData={getSODetailsData}
                deviceDataList={soDetailsList}
                getDeviceDataList={getSODetailsList}
                updateDeviceDataList={updateSODataList}
                setDeviceDetailsLoaded={setDeviceDetailsLoaded}
              />
            </Box>
            <Box width={{ tablet: '100%', desktop: '49.2%' }}>
              <Message
                sOData={sODetailsData}
                getSOData={getSODetailsData}
                sODataList={soDetailsList}
                getSODataList={getSODetailsList}
                updateSODataList={updateSODataList}
              />
            </Box>
          </Box>
          <Box mt={4}>
            <ServiceOrderArticle />
          </Box>
          <Box mt={4}>
            <ArticleUsageOrdering />
          </Box>
          <Box
            mt={4}
            display="flex"
            flexDirection={{ tablet: 'column', desktop: 'row' }}
            justifyContent="space-between"
            rowGap={2}
          >
            <Box width={{ tablet: '100%', desktop: '60.2%' }}>
              <PersonalExpenses setPersonalEffortsData={setPersonalEffortsData} />
            </Box>
            <Box width={{ tablet: '100%', desktop: '38.2%' }}>
              <SORep />
            </Box>
          </Box>
          <Box mt={2} display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box
              width={{ tablet: '48%', desktop: '60.2%' }}
              minWidth="272px"
              sx={{ cursor: 'pointer' }}
              onClick={handleOpenKvModal}
            >
              <ActionTile
                heading={t('KV')}
                subHeading={t('ESTIMATED_COST')}
                icon={
                  <Box
                    component="img"
                    src={mailIcon}
                    alt="kv icon"
                    sx={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
              />
            </Box>
            <Box
              width={{ tablet: '48%', desktop: '38.2%' }}
              minWidth="272px"
              sx={{ cursor: 'pointer' }}
              onClick={handleOpenOfferModal}
            >
              <ActionTile
                heading={t('NEW_OFFER')}
                subHeading={t('CREATE_NEW_OFFER')}
                icon={
                  <Box
                    component="img"
                    src={fileIcon}
                    alt="file icon"
                    sx={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                }
              />
            </Box>
          </Box>
          <Box
            mt={4}
            display="flex"
            flexDirection={{ tablet: 'column', desktop: 'row' }}
            justifyContent="space-between"
            rowGap={2}
          >
            <Box width={{ tablet: '100%', desktop: '60.2%' }}>
              <Offer
                SORep={sODetailsData?.SO_Rep ?? 0}
                samOfferUId={samOfferUId}
                samOfferId={samOfferId}
                openCreateOfferModal={openCreateOfferModal}
                setOpenCreateOfferModal={setOpenCreateOfferModal}
                handleWoodOrderModal={handleWoodOrderModal}
                openOfferForCopy={openOfferForCopy}
                setOpenOfferForCopy={setOpenOfferForCopy}
              />
            </Box>
            <Box width={{ tablet: '100%', desktop: '38.2%' }}>
              <ExpenseCalculator
                sOData={sODetailsData}
                getSOData={getSODetailsData}
                sODataList={soDetailsList}
                getSODataList={getSODetailsList}
                updateSODataList={updateSODataList}
                isLoading={isLoadingServiceOrderDetails}
                SORep={sODetailsData?.SO_Rep ?? 0}
                statusChangeCallback={statusChangeCallback}
              />
            </Box>
          </Box>

          {openKvModal && (
            <KVEstimatedCost
              isItNewKv={isItNewKv}
              setIsItNewKv={setIsItNewKv}
              soRep={sODetailsData?.SO_Rep ?? 0}
              onClose={handleKvModalClose}
            />
          )}
          {openKvCreateConfirmModal && (
            <ConfirmationModal
              open
              details={
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body1">{t('NO_KV_AVAILABLE_FOR_SO', { soId })}</Typography>
                  <Typography variant="body1">{t('PROMPT_CREATE_NEW_KV')}</Typography>
                </Box>
              }
              primaryActionButton={{
                title: t('YES'),
                actionId: '',
                action: () => {
                  setOpenKvCreateConfirmModal(false);
                  setOpenKvModal(true);
                },
              }}
              discardButton={{
                title: t('NO'),
                action: () => {
                  setOpenKvCreateConfirmModal(false);
                },
              }}
            />
          )}

          {openWoodOrderModal && (
            <WoodOrderModal
              onClose={() => {
                setOpenWoodOrderModal(false);
                if (!isCopyOffer) {
                  setOpenCreateOfferModal(true);
                } else {
                  setOpenOfferForCopy(true);
                }
              }}
              showEditMode={false}
              samOfferUId={samOfferUId}
              samOfferId={samOfferId}
              showSamOfferWoodOrders={false}
            />
          )}
          {openOfferWoodOrderConfirmModal && (
            <ConfirmationModal
              open
              details={
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body1">{t('This SO has some Wood Orders.')}</Typography>
                  <Typography variant="body1">
                    {t('Do you want to create a new wood order?')}
                  </Typography>
                </Box>
              }
              primaryActionButton={{
                title: t('YES'),
                actionId: '',
                action: () => {
                  setOpenOfferWoodOrderConfirmModal(false);
                  setOpenWoodOrderModal(true);
                },
              }}
              discardButton={{
                title: t('NO'),
                action: () => {
                  setOpenOfferWoodOrderConfirmModal(false);
                  if (!isCopyOffer) {
                    setOpenCreateOfferModal(true);
                  } else {
                    setOpenOfferForCopy(true);
                  }
                },
              }}
            />
          )}
        </>
      }
    </>
  );
};

export default Details;
