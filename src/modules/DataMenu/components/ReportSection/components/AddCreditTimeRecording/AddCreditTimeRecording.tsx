import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CREDIT_TIME_APPOINTMENT_TYPE_ID, type CreditTimeRecordingFields } from '../../types';
import { type Appointment } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useAbsenceAndCreditTime } from '@/src/hooks/useAbsenceAndCreditTime/useAbsenceAndCreditTime.hook';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { combineDateTime } from '@/src/helpers/formatDate';

interface Props {
  onClose: () => void;
  onSave: (formData: CreditTimeRecordingFields) => void;
}

const AddCreditTimeRecording = ({ onClose, onSave }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const { getDataList: getAppointmentsData } = useIndexedDbData<Appointment>(
    'TourPlanData',
    'Appointments'
  );

  const [creditTimeRecordingFields, setCreditTimeRecordingFields] =
    useState<CreditTimeRecordingFields | null>(null);
  const [formDataToSave, setFormDataToSave] = useState<CreditTimeRecordingFields | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreditTimeRecordingFields>({
    mode: 'onTouched',
    defaultValues: {},
  });

  const validationResponse = useAbsenceAndCreditTime(
    CREDIT_TIME_APPOINTMENT_TYPE_ID,
    combineDateTime(
      creditTimeRecordingFields?.StartDate ?? null,
      creditTimeRecordingFields?.StartTime ?? null
    ),
    null,
    combineDateTime(
      creditTimeRecordingFields?.StartDate ?? null,
      creditTimeRecordingFields?.EndTime ?? null
    ),
    null,
    null,
    creditTimeRecordingFields?.CreditReason ?? null,
    null
  );

  useEffect(() => {
    if (validationResponse.length && formDataToSave) {
      validationResponse.map((error) => dispatch(showErrorMessage(error)));
      setFormDataToSave(null);
    }

    if (validationResponse.length === 0 && formDataToSave) {
      onSave(formDataToSave);
      setFormDataToSave(null);
    }
  }, [validationResponse, formDataToSave]);

  const onSubmit: SubmitHandler<CreditTimeRecordingFields> = (formData) => {
    setCreditTimeRecordingFields({
      CreditReason: formData.CreditReason,
      StartDate: formData.StartDate,
      StartTime: formData.StartTime,
      EndTime: formData.EndTime,
    });

    setFormDataToSave(formData);
  };

  const watchStartTime = watch('StartTime');
  const watchEndTime = watch('EndTime');

  const validateTime = () => {
    if (watchStartTime && watchEndTime && dayjs(watchStartTime).isAfter(dayjs(watchEndTime))) {
      setError('StartTime', { type: 'manual', message: t('START_TIME_MUST_BE_BEFORE_END_TIME') });
      setError('EndTime', { type: 'manual', message: t('END_TIME_MUST_BE_AFTER_START_TIME') });
      return false;
    } else {
      clearErrors(['StartTime', 'EndTime']);
      return true;
    }
  };

  useEffect(() => {
    validateTime();
  }, [watchStartTime, watchEndTime]);

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

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
        },
      ]}
    />
  );

  return (
    <CustomModal open onClose={onClose} title={t('CREDIT_TIME_RECORDING')} actions={modalActions}>
      <Grid container rowSpacing={4}>
        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2">{t('REASON_FOR_CREDIT')}</Typography>
          <TextField
            {...register('CreditReason', { required: true })}
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            {...(errors.CreditReason && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Grid>

        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2">{t('SELECT_DATE')}</Typography>
          <Controller
            name="StartDate"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  value={field.value ?? null}
                  label={t('START_DATE')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!errors.StartDate,
                      helperText: errors.StartDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2">{t('SELECT_TIME')}</Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="StartTime"
              control={control}
              rules={{
                validate: validateTime,
                required: t('FIELD_IS_REQUIRED'),
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    {...field}
                    orientation="landscape"
                    value={field.value ?? null}
                    label={t('START_TIME')}
                    sx={{ width: '100%' }}
                    slotProps={{
                      toolbar: {
                        sx: {
                          '.MuiTimePickerToolbar-separator': {
                            lineHeight: '4.3rem',
                          },
                        },
                      },
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.StartTime,
                        helperText: errors.StartTime?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
            <Controller
              name="EndTime"
              control={control}
              rules={{
                validate: validateTime,
                required: t('FIELD_IS_REQUIRED'),
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    {...field}
                    orientation="landscape"
                    value={field.value ?? null}
                    label={t('END_TIME')}
                    sx={{ width: '100%' }}
                    slotProps={{
                      toolbar: {
                        sx: {
                          '.MuiTimePickerToolbar-separator': {
                            lineHeight: '4.3rem',
                          },
                        },
                      },
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.EndTime,
                        helperText: errors.EndTime?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default AddCreditTimeRecording;
