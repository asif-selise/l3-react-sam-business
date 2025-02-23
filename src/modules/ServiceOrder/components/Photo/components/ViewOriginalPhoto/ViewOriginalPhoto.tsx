import CustomModal from '@/src/components/CustomModal/CustomModal';
import { type PhotoData } from '@/src/hooks/useGetCompressedPhotos/types';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress } from '@mui/material';
import InfoGrid from '@/src/components/InfoGrid/InfoGrid';
import { getDate } from '@/src/helpers/formatDate';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useSelector } from '@/src/redux/store';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

interface Props {
  photoDetail: PhotoData;
  isLoading: boolean;
  originalBase64Image: string;
  onClose: () => void;
  onUpdatePhotoDetails: (remarks: string, sortOrder: number) => void;
  onDeletePhoto: () => void;
  isEditDeleteDisabled?: boolean;
}

const ViewOriginalPhoto = ({
  photoDetail,
  isLoading,
  originalBase64Image,
  onClose,
  onUpdatePhotoDetails,
  onDeletePhoto,
  isEditDeleteDisabled = false,
}: Props) => {
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [isEditMode, setIsEditMode] = useState(false);
  const [remarks, setRemarks] = useState<string>(photoDetail.Remarks ?? '');
  const [sortOrder, setSortOrder] = useState<number>(photoDetail.SortOrder);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

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
    <CustomModal
      title={t('ORIGINAL_PHOTO')}
      open
      actions={modalActions}
      onClose={onClose}
      variant="md"
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box
          sx={{
            position: 'relative',
            width: '65%',
            height: '600px',
            display: 'flex',
          }}
        >
          {isLoading ? (
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
          ) : (
            //             <Box
            //   sx={{
            //     position: 'relative',
            //     width: '100%',
            //     height: '100%',
            //   }}
            // >
            <Box
              component="img"
              src={originalBase64Image}
              alt={photoDetail.PhotoName}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'top',
              }}
            />
            // {/* </Box> */}
          )}
        </Box>
        <Box sx={{ width: '35%' }}>
          <Card sx={{ height: 'max-content' }}>
            <CardHeader
              title={t('PHOTO_DETAILS')}
              action={
                <>
                  <Button
                    disabled={isSoReadOnly || isEditDeleteDisabled}
                    color="primary"
                    onClick={() => {
                      if (isEditMode) {
                        onUpdatePhotoDetails(remarks, sortOrder);
                      }
                      setIsEditMode(!isEditMode);
                    }}
                  >
                    {isEditMode ? t('SAVE') : t('EDIT')}
                  </Button>
                  {isEditMode && (
                    <Button
                      color="primary"
                      onClick={() => {
                        setIsEditMode(false);
                        setRemarks(photoDetail.Remarks ?? '');
                        setSortOrder(photoDetail.SortOrder);
                      }}
                    >
                      {t('DISCARD')}
                    </Button>
                  )}
                </>
              }
            />
            <CardContent>
              <InfoGrid sx={{ marginBottom: '16px' }} label={t('ID')} value={photoDetail.Id} />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={t('NAME')}
                value={photoDetail.PhotoName}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={t('MODIFIED_ON')}
                value={getDate(photoDetail.ModifiedOn) ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={t('MODIFIED_BY')}
                value={photoDetail.ModifiedBy ?? '-'}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={t('REMARKS')}
                value={remarks}
                isEditMode={isEditMode}
                onChange={(value) => {
                  setRemarks(value);
                }}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={t('SORT_ORDER')}
                value={sortOrder}
                isEditMode={isEditMode}
                onChange={(value) => {
                  if (!isNaN(Number(value))) {
                    setSortOrder(Number(value));
                  }
                }}
              />
            </CardContent>
          </Card>

          <Button
            disabled={isSoReadOnly || isEditDeleteDisabled}
            variant="contained"
            size="large"
            color="error"
            sx={{ marginTop: '16px', width: '100%' }}
            onClick={() => {
              setOpenConfirmationModal(true);
            }}
          >
            {t('DELETE_PHOTO')}
          </Button>
        </Box>
      </Box>
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('DELETE_PHOTO_CONFIRMATION')}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: () => {
              onDeletePhoto();
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
    </CustomModal>
  );
};

export default ViewOriginalPhoto;
