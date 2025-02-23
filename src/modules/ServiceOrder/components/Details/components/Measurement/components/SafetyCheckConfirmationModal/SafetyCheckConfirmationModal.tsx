import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Typography } from '@mui/material';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';

interface SafetyCheckConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

const SafetyCheckConfirmationModal: React.FC<SafetyCheckConfirmationModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation('index');

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('TOUCH_SILVER_BUTTON'),
          onClick: onClose,
          variant: 'contained',
        },
      ]}
    />
  );

  return (
    <CustomModal
      title={t('SAFETY_CHECK_CONFIRMATION')}
      open={open}
      actions={modalActions}
      onClose={onClose} // Ensure the parent-provided onClose is used
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          height: { tablet: 'calc(100vh - 250px)', desktop: 'calc(90vh - 190px)' },
        }}
      >
        <Card
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/safetytest_1ltButtonRed.png"
            alt={t('SAFETY_DEVICE_IMAGE')}
            style={{
              objectFit: 'contain',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
            }}
          />
        </Card>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            {t('SECURITY_CHECK')}
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 4 }}>
            {t('SAFETY_CHECK_CONFIRMATION_TEXT')}
          </Typography>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default SafetyCheckConfirmationModal;
