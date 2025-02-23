import React from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';

interface Props {
  onClose: () => void;
}

const QrInfo = ({ onClose }: Props) => {
  const { t } = useTranslation('index');

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: 'OK',
          onClick: onClose,
          variant: 'outlined',
        },
      ]}
    />
  );

  const instructions = [t('CAMERA_INSTRUCTIONS_1_BUTTONS'), t('CAMERA_INSTRUCTIONS_2_QR_CODE')];

  return (
    <>
      <CustomModal
        title={t('INFORMATION')}
        open
        onClose={onClose}
        actions={modalActions}
        variant="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {instructions.map((instruction, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{instruction}</Typography>
            </Box>
          ))}
        </Box>
      </CustomModal>
    </>
  );
};

export default QrInfo;
