import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type EditESOFields } from '../../types';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { type TableData } from '@/src/components/CustomTable/types';
import { getDateTime } from '@/src/helpers/formatDate';

interface Props {
  data: TableData;
  isDisabled: boolean;
  onClose: () => void;
  onSumitForm: (formData: EditESOFields) => void;
}

const EditESO = ({ data, isDisabled = false, onClose, onSumitForm }: Props) => {
  const { t } = useTranslation('index');
  const { register, handleSubmit, control } = useForm<EditESOFields>({
    mode: 'onTouched',
    defaultValues: {
      UId: data.UId as string,
      ID: data.WorkflowId as string,
      ESO: data.ItemType as string,
      SO: data.OrderId as string,
      Remarks: data.WorkflowRemark as string,
      CreatedBy: data.Creator as string,
      CreatedOn: data.CreatedAt ? getDateTime(data.CreatedAt as string) : '',
      AssignedBy: data.Processor as string,
      AssignedOn: data.ProcessingTime ? getDateTime(data.ProcessingTime as string) : '',
      ChangedBy: data.LastChangedBy as string,
      ChangedOn: data.LastUpdatedAt ? getDateTime(data.LastUpdatedAt as string) : '',
      DoneBy: data.DoneBy as string,
      DoneOn: data.DoneOn ? getDateTime(data.DoneOn as string) : '',
    },
  });

  const onSubmit: SubmitHandler<EditESOFields> = (formData) => {
    onSumitForm(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

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
          onClick: handleSubmitForm,
          disabled: isDisabled,
        },
      ]}
    />
  );

  return (
    <CustomModal
      title={t('ELECTRONIC_SERVICE_ORDER')}
      open
      onClose={onClose}
      actions={modalActions}
    >
      <Grid container spacing={3} aria-label="eso-create-form">
        <Grid item mobile={4}>
          <TextField
            label="ID"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('ID')}
          />
        </Grid>
        <Grid item mobile={4}>
          <TextField
            label="ESO"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('ESO')}
          />
        </Grid>
        <Grid item mobile={4}>
          <TextField
            label="SO"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('SO')}
          />
        </Grid>

        <Grid item mobile={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('REMARKS')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('Remarks')}
          />
        </Grid>

        <Grid item mobile={12} sx={{ display: 'flex', justifyContent: 'end' }}>
          <Controller
            name="OrderTime"
            control={control}
            defaultValue="Before"
            render={({ field }) => (
              <FormControl disabled={isDisabled}>
                <RadioGroup row aria-label="OrderTime" {...field} sx={{ gap: 2 }}>
                  <FormControlLabel
                    value="Before"
                    control={<Radio color="default" />}
                    label={<Typography variant="body2">{t('BEFORE')}</Typography>}
                  />
                  <FormControlLabel
                    value="After"
                    control={<Radio color="default" />}
                    label={<Typography variant="body2">{t('AFTER')}</Typography>}
                    sx={{ mr: 0 }}
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item mobile={12}>
          <TextField
            fullWidth
            label={t('ADD_COMMENT')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('Comments')}
            disabled={isDisabled}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('CREATED_BY')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('CreatedBy')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('CREATED_ON')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('CreatedOn')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('ASSIGNED_BY')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('AssignedBy')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('ASSIGNED_ON')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('AssignedOn')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('CHANGED_BY')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('ChangedBy')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('CHANGED_ON')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('ChangedOn')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('DONE_BY')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('DoneBy')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            label={t('DONE_ON')}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ readOnly: true }}
            {...register('DoneOn')}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default EditESO;
