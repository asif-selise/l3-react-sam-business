import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Webcam from '@/src/components/Webcam/Webcam';
import { type CapturedPhoto } from '../../types';

interface Props {
  onClose: () => void;
  onSavePhoto: (capturedPhoto: CapturedPhoto) => void;
}

const NewPhoto = ({ onClose, onSavePhoto }: Props) => {
  const { t } = useTranslation('index');

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<number>(0);

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

  const handleSavePhoto = () => {
    if (!capturedImage) return;

    const base64Prefix = 'data:image/png;base64,';
    const updatedCapturedImageBase64 = capturedImage.substring(base64Prefix.length);

    onSavePhoto({
      Base64String: updatedCapturedImageBase64,
      Remarks: remarks,
      SortOrder: sortOrder,
    });

    setCapturedImage(null);
  };

  return (
    <CustomModal title={t('NEW_PHOTO')} open actions={modalActions} onClose={onClose}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ width: '75%' }}>
          <Webcam capturedImage={capturedImage} setCapturedImage={setCapturedImage} />
        </Box>

        <Box sx={{ width: '25%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label={t('REMARKS')}
            disabled={!capturedImage}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('SORT_ORDER')}
            disabled={!capturedImage}
            value={sortOrder}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setSortOrder(Number(e.target.value));
              }
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Button
            color="primary"
            onClick={() => {
              setCapturedImage(null);
            }}
            size="large"
            fullWidth
            variant="outlined"
            disabled={!capturedImage}
          >
            {t('TAKE_NEW_PHOTO')}
          </Button>
          <Button
            color="primary"
            onClick={handleSavePhoto}
            size="large"
            fullWidth
            variant="contained"
            disabled={!capturedImage}
          >
            {t('SAVE_PHOTO')}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default NewPhoto;
