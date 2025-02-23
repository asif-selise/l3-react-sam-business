import { Box } from '@mui/material';
import WoodOrder from './components/WoodOrder/WoodOrder';
import Details from './components/Details/Details';
import ImageDetails from './components/ImageDetails/ImageDetails';
import { useEffect, useState } from 'react';
import { type ServiceOrderOverview } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useSelector } from '@/src/redux/store';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

type WoodOrderModalType = 'completion-status' | 'initial' | '';
const COMPLETION_STATUS_BITTE_WAHLEN = '15';

interface Props {
  showEditMode?: boolean;
  samOfferUId: string | null;
  samOfferId: number | null;
  showSamOfferWoodOrders: boolean;
}

export interface SelectedWoodOrderDetails {
  Id: number;
  isNew: boolean;
}

const WoodOrderDetails = ({
  showEditMode = true,
  samOfferUId,
  samOfferId,
  showSamOfferWoodOrders,
}: Props) => {
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');
  const [selectedWoodOrderID, setSelectedWoodOrderID] = useState<number | null>(null);
  const [selectedWoodOrderDetails, setSelectedWoodOrderDetails] =
    useState<SelectedWoodOrderDetails>();

  const soId = useSelector((state) => state.serviceOrder.id);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(!isSoReadOnly);
  const [confirmationModalType, setConfirmationModalType] = useState<WoodOrderModalType>('initial');
  const [confirmationModalDetail, setConfirmationModalDetail] = useState<string>(
    t('WOOD_ORDERS_ARE_RECORDED')
  );

  const { dataItem: sOData, getDataItem: getSOData } = useIndexedDbData<ServiceOrderOverview>(
    'TourPlanData',
    'ServiceOrderOverviews'
  );

  useEffect(() => {
    getSOData('OrderId', soId).then();
  }, [soId]);

  const handleModalAction = () => {
    if (
      confirmationModalType === 'initial' &&
      sOData &&
      sOData.WorkflowItem_Rs !== COMPLETION_STATUS_BITTE_WAHLEN
    ) {
      setConfirmationModalType('completion-status');
      setConfirmationModalDetail(t('WOOD_ORDER_MAY_NOT_BE_PROCESSED'));
    } else {
      setConfirmationModalType('');
      setOpenConfirmationModal(false);
    }
  };

  return (
    <Box display={'flex'} flexDirection="column" rowGap={4}>
      <WoodOrder
        selectedWoodOrderID={selectedWoodOrderID}
        samOfferUId={samOfferUId}
        samOfferId={samOfferId}
        setSelectedWoodOrderID={setSelectedWoodOrderID}
        setSelectedWoodOrderDetails={setSelectedWoodOrderDetails}
        completionStatus={sOData?.WorkflowItem_Rs !== COMPLETION_STATUS_BITTE_WAHLEN}
        showEditMode={showEditMode}
        showSamOfferWoodOrders={showSamOfferWoodOrders}
      />
      <Details
        selectedWoodOrderID={selectedWoodOrderID}
        selectedWoodOrderDetails={selectedWoodOrderDetails}
        setSelectedWoodOrderDetails={setSelectedWoodOrderDetails}
        showEditMode={showEditMode}
        completionStatus={sOData?.WorkflowItem_Rs !== COMPLETION_STATUS_BITTE_WAHLEN}
      />

      {showEditMode && (
        <ImageDetails
          woodOrderDetails={selectedWoodOrderDetails}
          completionStatus={sOData?.WorkflowItem_Rs !== COMPLETION_STATUS_BITTE_WAHLEN}
        />
      )}
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title={`SAM - Service 7000 AG`}
          details={confirmationModalDetail}
          discardButton={{
            title: t('YES'),
            variant: 'contained',
            action: handleModalAction,
          }}
        />
      )}
    </Box>
  );
};

export default WoodOrderDetails;
