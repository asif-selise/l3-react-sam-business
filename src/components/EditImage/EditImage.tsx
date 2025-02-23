import React, { lazy, Suspense, useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';

const FilerobotImageEditor = lazy(() => import('react-filerobot-image-editor'));

// const FilerobotImageEditor = dynamic(async () => await import('react-filerobot-image-editor'), {
//   ssr: false,
// });
interface Props {
  image: string;
  onClose: () => void;
  onSaveImage: (editedImage: string) => void;
  editImageConfig?: Partial<FilerobotImageEditorConfig>;
  hideBackdrop?: boolean;
}

const EditImage = ({
  image,
  onClose,
  onSaveImage,
  editImageConfig,
  hideBackdrop = false,
}: Props) => {
  const { t } = useTranslation('index');
  const [editedImage, setEditedImage] = useState<string>(image);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onClose,
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: () => {
            onSaveImage(editedImage);
          },
        },
      ]}
    />
  );

  return (
    <CustomModal
      open
      onClose={onClose}
      title={t('EDIT_IMAGE')}
      actions={modalActions}
      sx={{ zIndex: 1500 }}
      hideBackdrop={hideBackdrop}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <FilerobotImageEditor
          source={editedImage}
          onBeforeSave={(imageFileInfo) => false}
          onSave={(imageData, imageDesignState) => {
            const newImageBase64 = imageData.imageBase64;
            if (newImageBase64) setEditedImage(newImageBase64);
          }}
          defaultSavedImageQuality={0.97}
          Text={{ text: 'SAM...' }}
          annotationsCommon={{
            fill: '#ff0000',
          }}
          Crop={{ ratio: 'custom' }}
          savingPixelRatio={4}
          previewPixelRatio={window.devicePixelRatio}
          defaultTabId={'Adjust'}
          defaultToolId={'Crop'}
          disableSaveIfNoChanges
          showBackButton
          useBackendTranslations={false}
          translations={{
            save: 'Confirm',
          }}
          {...editImageConfig}
        />
      </Suspense>
    </CustomModal>
  );
};

export default EditImage;

//need to work here
