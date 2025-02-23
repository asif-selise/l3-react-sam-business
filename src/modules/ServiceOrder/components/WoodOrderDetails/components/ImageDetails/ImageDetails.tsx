import { Box, Card, CardHeader, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReferenceImage from './components/ReferenceImage/ReferenceImage';
import ActionButton from './components/ActionButton/ActionButton';
import PhotoGrid from '../../../Photo/components/PhotoGrid/PhotoGrid';
import ViewOriginalPhoto from '../../../Photo/components/ViewOriginalPhoto/ViewOriginalPhoto';
import { type CapturedPhoto } from '../../../Photo/types';
import NewPhoto from '../../../Photo/components/NewPhoto/NewPhoto';
import usePhotoManagement from '@/src/hooks/usePhotoManagement/usePhotoManagement';
import { type PhotoData } from '@/src/hooks/useGetCompressedPhotos/types';
import { useDispatch } from '@/src/redux/store';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { type SelectedWoodOrderDetails } from '../../WoodOrderDetails';

interface Props {
  completionStatus: boolean;
  woodOrderDetails: SelectedWoodOrderDetails | undefined;
}

const ImageDetails = ({ completionStatus, woodOrderDetails }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const serviceType = 'Holzbestellung';

  const [openNewPhoto, setOpenNewPhoto] = useState(false);

  const {
    photos,
    selectedPhoto,
    setSelectedPhoto,
    handleUpdatePhotoDetails,
    handleDeletePhoto,
    handleSavePhoto: onSavePhoto,
    originalBase64Image,
    isPhotosLoading,
    isNoPhotosFound,
    isOriginalPhotoLoading,
  } = usePhotoManagement({ serviceType, WoodOrderDetailId: woodOrderDetails?.Id });

  const [filteredPhotos, setFilteredPhotos] = useState<PhotoData[]>([]);

  const getFilteredPhotos = () => {
    if (!woodOrderDetails) {
      setFilteredPhotos([]);
      return;
    }

    const newFilteredPhotos = photos.filter(
      (photo) => photo.WoodOrderDetailId === woodOrderDetails.Id
    );

    setFilteredPhotos(newFilteredPhotos);
  };

  useEffect(() => {
    getFilteredPhotos();
  }, [photos, woodOrderDetails]);

  const handleSavePhoto = (capturedPhoto: CapturedPhoto) => {
    onSavePhoto(capturedPhoto);
    setOpenNewPhoto(false);
  };

  const handleOpenNewPhoto = () => {
    if (!woodOrderDetails?.Id) {
      dispatch(showErrorMessage(t('PLEASE_SELECT_WOOD_ORDER_DETAIL_FIRST')));
    } else if (woodOrderDetails?.isNew) {
      dispatch(showErrorMessage(t('PLEASE_SYNC_NEW_WOOD_ORDER_DETAIL_FIRST')));
    } else {
      setOpenNewPhoto(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={t('IMAGE_DETAILS')}
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <Box p={'16px'} width={'100%'} mt={'24px'} display={'flex'} columnGap={'24px'}>
          <Box
            width={'65%'}
            sx={{
              p: 3,
              position: 'relative',
              borderRadius: '10px',
              border: '1px solid rgba(145, 158, 171, 0.24)',
            }}
          >
            {isPhotosLoading && (
              <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
            )}
            {(isNoPhotosFound || !filteredPhotos.length) && (
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {t('NO_PHOTOS_FOUND')}
              </Typography>
            )}
            {!isPhotosLoading && filteredPhotos.length > 0 && (
              <PhotoGrid photos={filteredPhotos} onPhotoClick={setSelectedPhoto} size={100} />
            )}
          </Box>
          <Box width={'35%'}>
            <ActionButton
              label={t('ADD_NEW_PHOTO')}
              onClick={handleOpenNewPhoto}
              icon="mdi:camera"
              disabled={completionStatus}
            />
            <Box
              width={'100%'}
              mt={4}
              sx={{
                padding: '0px 16px 0px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(145, 158, 171, 0.24)',
              }}
            >
              <ReferenceImage />
            </Box>
          </Box>
        </Box>
      </Card>

      {selectedPhoto && (
        <ViewOriginalPhoto
          photoDetail={selectedPhoto}
          isLoading={isOriginalPhotoLoading}
          originalBase64Image={originalBase64Image}
          onClose={() => {
            setSelectedPhoto(null);
          }}
          onUpdatePhotoDetails={handleUpdatePhotoDetails}
          onDeletePhoto={handleDeletePhoto}
          isEditDeleteDisabled={completionStatus}
        />
      )}

      {openNewPhoto && (
        <NewPhoto
          onSavePhoto={handleSavePhoto}
          onClose={() => {
            setOpenNewPhoto(false);
          }}
        />
      )}
    </>
  );
};

export default ImageDetails;
