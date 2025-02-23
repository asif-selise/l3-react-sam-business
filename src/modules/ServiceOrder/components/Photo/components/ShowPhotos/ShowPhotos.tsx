import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { type Dispatch, type SetStateAction } from 'react';
import ViewOriginalPhoto from '../ViewOriginalPhoto/ViewOriginalPhoto';
import NewPhoto from '../NewPhoto/NewPhoto';
import { type CapturedPhoto } from '../../types';
import { useTranslation } from 'react-i18next';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import usePhotoManagement from '@/src/hooks/usePhotoManagement/usePhotoManagement';

interface Props {
  openNewPhoto: boolean;
  setOpenNewPhoto: Dispatch<SetStateAction<boolean>>;
}

const ShowPhotos = ({ openNewPhoto, setOpenNewPhoto }: Props) => {
  const { t } = useTranslation('index');
  const serviceType = 'KV';

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
  } = usePhotoManagement({ serviceType });

  const handleSavePhoto = (capturedPhoto: CapturedPhoto) => {
    onSavePhoto(capturedPhoto);
    setOpenNewPhoto(false);
  };

  return (
    <>
      {isPhotosLoading && (
        <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
      )}

      {isNoPhotosFound && (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ position: 'absolute', top: '50%', left: '50%' }}
        >
          {t('NO_PHOTOS_FOUND')}
        </Typography>
      )}

      {!isPhotosLoading && photos.length > 0 && (
        <Card>
          <CardContent>
            <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
          </CardContent>
        </Card>
      )}

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

export default ShowPhotos;
