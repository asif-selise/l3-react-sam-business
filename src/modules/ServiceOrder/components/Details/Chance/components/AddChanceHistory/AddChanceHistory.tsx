import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Grid, TextField } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type ServiceOrderComplaintDetailFields } from '../../types';
import dayjs from 'dayjs';

interface Props {
  onSubmitForm: (formData: ServiceOrderComplaintDetailFields) => void;
  onClose: () => void;
  onDiscard: () => void;
}

const AddChanceHistory = ({ onSubmitForm, onClose, onDiscard }: Props) => {
  const { t } = useTranslation('index');

  const { register, control, watch, handleSubmit } = useForm<ServiceOrderComplaintDetailFields>({
    mode: 'onTouched',
    defaultValues: {
      EntryDateTime: dayjs(),
      MustBeCompletedByDateTime: dayjs().add(3, 'day'),
    },
  });

  const watchEntryDateTime = watch('EntryDateTime');
  const watchMustBeCompletedByDateTime = watch('MustBeCompletedByDateTime');

  const onSubmit: SubmitHandler<ServiceOrderComplaintDetailFields> = (formData) => {
    onSubmitForm(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };
  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onDiscard,
          variant: 'outlined',
        },
        {
          label: t('BACK'),
          onClick: onClose,
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: handleSubmitForm,
        },
      ]}
    />
  );

  return (
    <CustomModal
      open={true}
      title={t('ADD_CHANCE_HISTORY')}
      actions={modalActions}
      onClose={onClose}
    >
      <Grid container spacing={3} aria-label="add-chance-history-form">
        <Grid item mobile={6}>
          <Controller
            name="EntryDateTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  label={t('ENTRANCE')}
                  format="DD.MM.YYYY"
                  value={watchEntryDateTime}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item mobile={6}>
          <Controller
            name="MustBeCompletedByDateTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  label={t('MUST_BE_COMPLETED_BY')}
                  format="DD.MM.YYYY"
                  value={watchMustBeCompletedByDateTime}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            name="MailReceivedOnDateTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  label={t('MAIL_RECEIVED_ON')}
                  format="DD.MM.YYYY"
                  value={null}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item mobile={6}>
          <Controller
            name="CompletedOnDateTime"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  label={t('COMPLETED')}
                  format="DD.MM.YYYY"
                  value={null}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('REMARKS')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('Remark')}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default AddChanceHistory;
