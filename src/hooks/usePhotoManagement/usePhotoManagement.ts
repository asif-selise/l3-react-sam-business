import { useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import useSavePhoto from '@/src/hooks/useSavePhoto/useSavePhoto';
import useUpdatePhotoDetails from '@/src/hooks/useUpdatePhotoDetails/useUpdatePhotoDetails';
import useDeletePhoto from '@/src/hooks/useDeletePhoto/useDeletePhoto';
import useGetCompressedPhotos from '@/src/hooks/useGetCompressedPhotos/useGetCompressedPhotos';
import useGetOriginalPhoto from '@/src/hooks/useGetOriginalPhoto/useGetOriginalPhoto';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { useDispatch, useSelector } from 'react-redux';
import { constructBase64Image } from '@/src/helpers/photoUtils';
import { type PhotoData } from '../useGetCompressedPhotos/types';
import { type CapturedPhoto } from '@/src/modules/ServiceOrder/components/Photo/types';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useTranslation } from 'react-i18next';

interface Props {
  serviceType: string;
  WoodOrderDetailId?: number;
}

interface ReturnType {
  photos: PhotoData[];
  selectedPhoto: PhotoData | null;
  setSelectedPhoto: Dispatch<SetStateAction<PhotoData | null>>;
  handleUpdatePhotoDetails: (remarks: string, sortOrder: number) => void;
  handleDeletePhoto: () => void;
  handleSavePhoto: (capturedPhoto: CapturedPhoto) => void;
  originalBase64Image: string;
  isOriginalPhotoLoading: boolean;
  isPhotosLoading: boolean;
  isNoPhotosFound: boolean;
}

const usePhotoManagement = ({ serviceType, WoodOrderDetailId = 0 }: Props): ReturnType => {
  const { t } = useTranslation('index');
  const soId = Number(useSelector((state: any) => state.serviceOrder.id));
  const dispatch = useDispatch();

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  const { data: technicianData } = useTechnicianData();
  const { submitSavePhoto } = useSavePhoto();
  const { submitUpdatePhotoDetails } = useUpdatePhotoDetails();
  const { submitDeletePhoto } = useDeletePhoto();
  const {
    data: photosData,
    isLoading: isPhotosLoading,
    refetch: fetchPhotos,
  } = useGetCompressedPhotos(soId, serviceType);
  const {
    data: originalPhotoData,
    isLoading: isOriginalPhotoLoading,
    refetch: fetchOriginalPhoto,
  } = useGetOriginalPhoto(soId, serviceType, selectedPhoto?.PhotoName ?? '');

  useEffect(() => {
    if (photosData) {
      const updatedPhotos = photosData.map((photo) => ({
        ...photo,
        Base64String: constructBase64Image(photo.PhotoName, photo.Base64String),
      }));

      setPhotos(updatedPhotos);
    }
  }, [photosData]);

  useEffect(() => {
    if (selectedPhoto?.PhotoName) {
      fetchOriginalPhoto();
    }
  }, [selectedPhoto]);

  const handleUpdatePhotoDetails = (remarks: string, sortOrder: number) => {
    if (!selectedPhoto) return;

    submitUpdatePhotoDetails({
      ServiceOrderNo: soId,
      ServiceType: serviceType,
      PhotoName: selectedPhoto.PhotoName,
      LoginUserName: selectedPhoto.ModifiedBy,
      TechnicianNumber,
      Remarks: remarks,
      SortOrder: sortOrder,
    });

    const updatedPhotos = photos.map((photo) => {
      if (photo.Id === selectedPhoto.Id) {
        return {
          ...photo,
          Remarks: remarks,
          SortOrder: sortOrder,
        };
      }
      return photo;
    });

    setPhotos(updatedPhotos);
  };

  const handleDeletePhoto = () => {
    if (!selectedPhoto) return;

    submitDeletePhoto({
      ServiceOrderNo: soId,
      ServiceType: serviceType,
      PhotoName: selectedPhoto.PhotoName,
    });

    const updatedPhotos = photos.filter((photo) => photo.Id !== selectedPhoto.Id);

    setPhotos(updatedPhotos);
    setSelectedPhoto(null);
  };

  const handleSavePhoto = (capturedPhoto: CapturedPhoto) => {
    submitSavePhoto(
      {
        ServiceOrderNo: soId,
        LoginUserName: systemUser,
        Base64Image: capturedPhoto.Base64String,
        ServiceType: serviceType,
        WoodOrderDetailId,
        TechnicianNumber,
        Remarks: capturedPhoto.Remarks,
        SortOrder: capturedPhoto.SortOrder,
      },
      {
        onSuccess: () => {
          dispatch(showSuccessMessage(t('PHOTO_SAVED_SUCCESSFULLY')));
          fetchPhotos();
        },
        onError: () => {
          dispatch(showErrorMessage(t('FAILED_TO_SAVE_PHOTO')));
        },
      }
    );
  };

  const systemUser = technicianData?.systemUser ?? '';
  const TechnicianNumber = technicianData?.technicianEmployeeNumber ?? 0;

  const originalBase64Image = originalPhotoData
    ? constructBase64Image(originalPhotoData.PhotoName, originalPhotoData.Base64String)
    : '';

  const isNoPhotosFound = !isPhotosLoading && (!photosData || photosData.length === 0);

  return {
    photos,
    selectedPhoto,
    setSelectedPhoto,
    handleUpdatePhotoDetails,
    handleDeletePhoto,
    handleSavePhoto,
    originalBase64Image,
    isPhotosLoading,
    isNoPhotosFound,
    isOriginalPhotoLoading,
  };
};

export default usePhotoManagement;
