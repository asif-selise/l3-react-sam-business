import React, { useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import ScanQRCode from '@/src/modules/ServiceOrder/components/QRCode/components/ScanQRCode/ScanQRCode';
import QrInfo from '@/src/modules/ServiceOrder/components/QRCode/components/QrInfo/QrInfo';

interface Props {
  onClose: () => void;
  enabledQRInfo?: boolean;
}

const QrCodeInfo = ({ onClose, enabledQRInfo = false }: Props) => {
  const { t } = useTranslation('index');
  const [openQrInfo, setOpenQrInfo] = useState(false);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onClose,
          variant: 'outlined',
        },
      ]}
    />
  );

  return (
    <>
      <CustomModal
        open
        onClose={onClose}
        title={t('QR_CODE_INFO')}
        actions={modalActions}
        buttonTopRight={{
          label: t('INFORMATION'),
          action: () => {
            setOpenQrInfo(true);
          },
          variant: 'outlined',
        }}
      >
        <ScanQRCode enabledQRInfo={enabledQRInfo} scanOption="read" />
      </CustomModal>

      {openQrInfo && (
        <QrInfo
          onClose={() => {
            setOpenQrInfo(false);
          }}
        />
      )}
    </>
  );
};

export default QrCodeInfo;
