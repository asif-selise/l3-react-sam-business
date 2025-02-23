import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import { Box, Button } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useCallback, useEffect, useState, useRef } from 'react';
import StickyContainer from '@/src/components/StickyContainer/StickyContainer';
import Details from './components/Details/Details';
import ESOHistory from './components/ESOHistory/ESOHistory';
import CustomerHistory from './components/CustomerHistory/CustomerHistory';
import SODocuments from './components/SODocuments/SODocuments';
import CheckList from './components/Checklist/Checklist';
import Photo from './components/Photo/Photo';
import QRCode from './components/QRCode/QRCode';
import { useTranslation } from 'react-i18next';
import { updateServiceOrderState } from '@/src/slices/serviceOrderSlice/serviceOrder.slice';
import { useDispatch, useSelector } from '@/src/redux/store';
import { updateSyncStatus } from '@/src/slices/syncSlice/sync.slice';
import useManageSoStatus from '@/src/hooks/useManageSoStatus/useManageSoStatus';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import { updateSoStatus } from '@/src/slices/soStatusSlice/soStatus.slice';
import WoodOrderDetails from '@/src/modules/ServiceOrder/components/WoodOrderDetails/WoodOrderDetails';
import { useNavigate } from 'react-router-dom';

const TAB_KEYS = {
  Details: 'details',
  ESOHistory: 'esoHistory',
  CustomerHistory: 'customerHistory',
  SODocuments: 'soDocuments',
  Admin: 'admin',
  Photo: 'photo',
  WoodOrder: 'woodOrder',
  Checklist: 'checklist',
  AdditionalSales: 'additionalSales',
  Navigation: 'navigation',
  QRCode: 'qrCode',
  Refresh: '',
} as const;

const ServiceOrder = () => {
  const { t } = useTranslation('index');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useManageSoStatus();
  const id = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');
  const { syncNeeded } = useAutoSync();
  const { soStatus, offerServiceOrder } = useSelector((state) => state.soStatus);
  const { resetUpdateData } = useSyncData();

  const TABS = [
    { value: TAB_KEYS.Details, label: t('DETAILS') },
    { value: TAB_KEYS.ESOHistory, label: t('ESO_HISTORY') },
    { value: TAB_KEYS.CustomerHistory, label: t('CUSTOMER_HISTORY') },
    { value: TAB_KEYS.SODocuments, label: t('SO_DOCUMENTS') },
    // { value: TAB_KEYS.Admin, label: t('ADMIN') },
    { value: TAB_KEYS.Photo, label: t('PHOTO') },
    { value: TAB_KEYS.WoodOrder, label: t('WOOD_ORDER') },
    { value: TAB_KEYS.Checklist, label: t('CHECKLIST') },
    // { value: TAB_KEYS.Navigation, label: t('NAVIGATION') },
    { value: TAB_KEYS.QRCode, label: t('QR_CODE') },
  ];

  const esoRef = useRef<{ handleOpenCreateESO: () => void } | null>(null);

  const checkListRef = useRef<{
    handleAddChecklist: () => void;
    handleDeleteConfirmChecklist: () => void;
  } | null>(null);

  const photoRef = useRef<{ handleOpenNewPhoto: () => void } | null>(null);

  const [currentTab, setCurrentTab] = useState('details');
  const [currentQRView, setCurrentQRView] = useState<'scan' | 'search'>('search');
  const [openScanQrOption, setOpenScanQrOption] = useState(false);
  const [scanQrOption, setScanQrOption] = useState<'discard' | 'replace' | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [detailsPageDataLoaded, setDetailsPageDataLoaded] = useState<boolean>(false);
  const [openStatusChangeConfirmationModal, setOpenStatusChangeConfirmationModal] =
    useState<boolean>(false);
  const [openNoStatusConfirmationModal, setOpenNoStatusConfirmationModal] =
    useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<number | null>();

  const [openApartmentIdNotFoundConfirmationModal, setOpenApartmentIdNotFoundConfirmationModal] =
    useState<boolean>(false);

  const [openStatusReadOnlyConfirmationModal, setOpenStatusReadOnlyConfirmationModal] =
    useState<boolean>(false);

  const { isBlockedServiceOrder } = useAutoSync();

  const {
    dataItem: soData,
    getDataItem: getSoData,
    getDataItemAsync: getSoDataAsync,
  } = useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);

    if (newValue === TAB_KEYS.QRCode) {
      setCurrentQRView('search');
    }
  }, []);

  const navigateBack = () => {
    navigate('/sam/dashboard');
  };

  const handleNavigateBack = async () => {
    const syncTrue = await syncNeeded();
    if (syncTrue) {
      const modifiedServiceOrderData = await getSoDataAsync('OrderId', id);
      if (
        modifiedServiceOrderData.ObjectApartmentId == null ||
        modifiedServiceOrderData.ObjectApartmentId === '00000000-0000-0000-0000-000000000000'
      ) {
        setOpenApartmentIdNotFoundConfirmationModal(true);
        return;
      }

      if (isSoReadOnly) {
        navigateBack();
      } else {
        setOpenConfirmationModal(true);
      }
    } else {
      navigateBack();
    }
  };

  const handleCheckStatus = async () => {
    if (currentStatus == null) {
      setOpenNoStatusConfirmationModal(true);
    } else {
      handleNavigateBack();
    }
  };

  useEffect(() => {
    if (
      soData &&
      !isSoReadOnly &&
      soData?.WorkflowItemRs != null &&
      soData?.WorkflowItemRs !== 15
    ) {
      if (detailsPageDataLoaded && soStatus) {
        setOpenStatusChangeConfirmationModal(true);
      }
    }

    if (isSoReadOnly && detailsPageDataLoaded) {
      setOpenStatusReadOnlyConfirmationModal(true);
    }
    setCurrentStatus(soData?.WorkflowItemRs);
  }, [soData, detailsPageDataLoaded, soStatus]);

  useEffect(() => {
    if (id) {
      getSoData('OrderId', id);
    }
  }, [id]);

  useEffect(() => {
    dispatch(updateSyncStatus({ autoSync: false }));
    return () => {
      dispatch(updateSyncStatus({ autoSync: true }));
    };
  }, []);

  useEffect(() => {
    const soId = localStorage.getItem('serviceOrderId');
    if ((!id || id === 0) && soId) {
      const parsedSoId = parseInt(soId, 10); // Make sure it's a number
      dispatch(updateServiceOrderState(parsedSoId));
    } else if (!soId) {
      navigate('/sam/dashboard');
    }
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (offerServiceOrder) {
      dispatch(updateSoStatus({ offerServiceOrder: false }));
      setCurrentTab(TAB_KEYS.Refresh);
      setTimeout(() => {
        setCurrentTab(TAB_KEYS.Details);
      }, 0);
    }
  }, [id]);

  const buttonNewESO = (
    <Button onClick={() => esoRef.current?.handleOpenCreateESO()} variant="outlined">
      {t('NEW_ESO')}
    </Button>
  );

  const changeQRView = () => {
    if (currentQRView === 'search') {
      setOpenScanQrOption(true);
    } else {
      setScanQrOption(null);
      setCurrentQRView('search');
    }
  };

  const buttonQRCode = (
    <Button onClick={changeQRView} variant="outlined">
      {currentQRView === 'scan' ? t('SEARCH_QR_CODE') : t('SCAN_QR_CODE')}
    </Button>
  );

  const buttonChecklist = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
      <Button
        disabled={isSoReadOnly}
        variant="contained"
        color="primary"
        onClick={() => checkListRef.current?.handleAddChecklist()}
      >
        {t('ADD_CHECKLIST')}
      </Button>
      <Button
        disabled={isSoReadOnly}
        variant="outlined"
        color="primary"
        onClick={() => checkListRef.current?.handleDeleteConfirmChecklist()}
      >
        {t('DELETE_CHECKLIST')}
      </Button>
    </Box>
  );

  const buttonPhoto = (
    <Button
      disabled={isSoReadOnly}
      variant="outlined"
      onClick={() => photoRef.current?.handleOpenNewPhoto()}
    >
      {t('NEW_PHOTO')}
    </Button>
  );

  const getTabButtons = () => {
    switch (currentTab) {
      case TAB_KEYS.QRCode:
        return buttonQRCode;
      case TAB_KEYS.Checklist:
        return buttonChecklist;
      case TAB_KEYS.ESOHistory:
        return buttonNewESO;
      case TAB_KEYS.Photo:
        return buttonPhoto;
      default:
        return null;
    }
  };

  const statusChangeCallback = (status: number | null) => {
    setCurrentStatus(status);
  };

  const getOpenStatusReadOnlyConfirmationModalDetail = () => {
    const soIdString = id.toString();
    const blockedSo = isBlockedServiceOrder(soIdString);

    return blockedSo ? t('LOCKED_SERVICE_ORDER') : t('SO_ORDER_READ_ONLY_MESSAGE');
  };

  return (
    <Box>
      <StickyContainer>
        <CustomBreadcrumbs
          heading={`#${String(id)} ${t('DAMAGE_REPORT')}`}
          backButton={{
            action: handleCheckStatus,
          }}
          links={[
            { name: `${t('DASHBOARD')}`, href: '/sam/dashboard' },
            { name: `${t('DETAILS')}` },
          ]}
          buttons={getTabButtons()}
        />

        <Tabs value={currentTab} onChange={handleChangeTab}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </StickyContainer>

      {currentTab === TAB_KEYS.Details && (
        <Details
          setDetailsPageDataLoaded={setDetailsPageDataLoaded}
          statusChangeCallback={statusChangeCallback}
        />
      )}
      {currentTab === TAB_KEYS.ESOHistory && <ESOHistory ref={esoRef} />}
      {currentTab === TAB_KEYS.CustomerHistory && <CustomerHistory />}
      {currentTab === TAB_KEYS.SODocuments && <SODocuments />}
      {/* {currentTab === TAB_KEYS.AdditionalSales && <Admin />} */}
      {currentTab === TAB_KEYS.Photo && <Photo ref={photoRef} />}
      {currentTab === TAB_KEYS.WoodOrder && (
        <WoodOrderDetails
          showEditMode={true}
          samOfferUId={null}
          samOfferId={null}
          showSamOfferWoodOrders={false}
        />
      )}
      {currentTab === TAB_KEYS.Checklist && <CheckList ref={checkListRef} />}
      {/* {currentTab === TAB_KEYS.Navigation && <Navigation />} */}
      {currentTab === TAB_KEYS.QRCode && (
        <QRCode
          currentView={currentQRView}
          setCurrentView={setCurrentQRView}
          openScanOption={openScanQrOption}
          setOpenScanOption={setOpenScanQrOption}
          scanOption={scanQrOption}
          setScanOption={setScanQrOption}
        />
      )}
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('ARE_YOU_SURE_YOU_WANT_TO_GO_BACK')}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: () => {
              navigateBack();
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
      {openStatusChangeConfirmationModal && (
        <ConfirmationModal
          open={openStatusChangeConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('SO_ORDER_MODIFIED_MESSAGE')}
          variant="sm"
          discardButton={{
            title: t('OK'),
            variant: 'contained',
            action: () => {
              setOpenStatusChangeConfirmationModal(false);
            },
          }}
        />
      )}
      {openNoStatusConfirmationModal && (
        <ConfirmationModal
          open={openNoStatusConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('NO_COMPLETION_STATUS_WARNING')}
          discardButton={{
            title: t('NO'),
            variant: 'contained',
            action: () => {
              setOpenNoStatusConfirmationModal(false);
              handleNavigateBack();
            },
          }}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: () => {
              setOpenNoStatusConfirmationModal(false);
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
            title: t('DISCARD_CHANGES_AND_BACK'),
            variant: 'contained',
            color: 'error',
            action: async () => {
              await resetUpdateData();
              setOpenApartmentIdNotFoundConfirmationModal(false);
              navigateBack();
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
      {openStatusReadOnlyConfirmationModal && (
        <ConfirmationModal
          open={openStatusReadOnlyConfirmationModal}
          title="SAM - Service 7000 AG"
          details={getOpenStatusReadOnlyConfirmationModalDetail()}
          variant="sm"
          discardButton={{
            title: t('OK'),
            variant: 'contained',
            action: () => {
              setOpenStatusReadOnlyConfirmationModal(false);
            },
          }}
        />
      )}
    </Box>
  );
};

export default ServiceOrder;
