import React from 'react';
import WoodOrderDetails from '../../../WoodOrderDetails/WoodOrderDetails';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  showEditMode?: boolean;
  hideBackdrop?: boolean;
  samOfferUId: string | null;
  samOfferId: number | null;
  showSamOfferWoodOrders: boolean;
}

const WoodOrderModal = ({
  onClose,
  samOfferUId,
  samOfferId,
  showEditMode = true,
  hideBackdrop = false,
  showSamOfferWoodOrders,
}: Props) => {
  const { t } = useTranslation('index');

  return (
    <CustomModal
      open
      title={t('WOOD_ORDER')}
      onClose={onClose}
      actions={
        <CustomModalActions
          actions={[{ label: t('DISCARD'), onClick: onClose, variant: 'outlined' }]}
        />
      }
      hideBackdrop={hideBackdrop}
    >
      <WoodOrderDetails
        showEditMode={showEditMode}
        samOfferUId={samOfferUId}
        samOfferId={samOfferId}
        showSamOfferWoodOrders={showSamOfferWoodOrders}
      />
    </CustomModal>
  );
};

export default WoodOrderModal;
