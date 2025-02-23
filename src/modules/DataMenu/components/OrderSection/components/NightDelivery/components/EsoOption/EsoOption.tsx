import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, Typography } from '@mui/material';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type FollowUpItemFields } from '../../types';

interface Props {
  onClose: () => void;
  openEsoCreation: () => void;
  onFollowUpItemSubmitForm: (newItemNo: string) => void;
}

const Modals = {
  EsoOptions: 'esoOptions',
  SecondOption: 'secondOption',
} as const;

const EsoOption = ({ onClose, openEsoCreation, onFollowUpItemSubmitForm }: Props) => {
  const { t } = useTranslation('index');

  const modalEsoOptions: ModalDetails = {
    name: Modals.EsoOptions,
    title: t('CREATING_ESO'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
    ],
  };

  const [currentModal, setCurrentModal] = useState<ModalDetails>(modalEsoOptions);

  const modalSecondOption: ModalDetails = {
    name: Modals.SecondOption,
    title: t('ENTER_NEW_ITEM_NO'),
    actions: [
      {
        label: t('OK'),
        onClick: () => {
          handleSubmitForm();
        },
      },
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
    ],
  };

  const onSubmit: SubmitHandler<FollowUpItemFields> = (formData) => {
    onFollowUpItemSubmitForm(formData.NewItemNo);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FollowUpItemFields>({
    mode: 'onSubmit',
  });

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const getModalActions = () => {
    switch (currentModal.name) {
      case Modals.SecondOption:
        return modalSecondOption.actions;
      case Modals.EsoOptions:
      default:
        return modalEsoOptions.actions;
    }
  };

  return (
    <CustomModal
      open
      onClose={onClose}
      title={currentModal.title}
      actions={<CustomModalActions actions={getModalActions()} />}
      variant="sm"
    >
      {currentModal.name === Modals.EsoOptions && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body1">{t('CREATING_ESO')}:</Typography>
            <Typography variant="body1">{t('PLEASE_SELECT_THE_DESIRED_ESO')}</Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={openEsoCreation}
            sx={{ width: '100%' }}
          >
            {t('ESO_MAT_OVERNIGHT_DELIVERY_NOT_AVAILABLE')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => {
              setCurrentModal(modalSecondOption);
            }}
          >
            {t('ESO_FOLLOW_UP_ITEM_DELIVERED')}
          </Button>
        </Box>
      )}

      {currentModal.name === Modals.SecondOption && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">
            {t('PLEASE_ENTER_THE_ITEM_NO_THE_RECEIVED_FOLLOW_UP_ARTICLE')}
          </Typography>
          <TextField
            fullWidth
            {...register('NewItemNo', { required: true })}
            {...(errors.NewItemNo && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
      )}
    </CustomModal>
  );
};

export default EsoOption;
