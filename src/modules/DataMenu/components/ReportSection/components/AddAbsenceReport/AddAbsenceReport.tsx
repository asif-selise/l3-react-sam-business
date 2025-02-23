import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CREDIT_TIME_APPOINTMENT_TYPE_ID, type AbsenceReportFields } from '../../types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type AppointmentType } from '@/src/hooks/useTourData/tourData.interface';
import { useEffect, useState } from 'react';
import { useAbsenceAndCreditTime } from '@/src/hooks/useAbsenceAndCreditTime/useAbsenceAndCreditTime.hook';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import dayjs from 'dayjs';

interface Props {
  onClose: () => void;
  onSave: (formData: AbsenceReportFields) => void;
  appointmentId?: number;
}

const AddAbsenceReport = ({ onClose, onSave, appointmentId }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const { dataList: appointmentTypesData, getDataList: getAppointmentTypesData } =
    useIndexedDbData<AppointmentType>('TourPlanData', 'AppointmentTypes');

  const [absenceFields, setAbsenseFields] = useState<AbsenceReportFields | null>(null);
  const [formDataToSave, setFormDataToSave] = useState<AbsenceReportFields | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<AbsenceReportFields>({
    mode: 'onTouched',
    defaultValues: {
      StartDate: dayjs(),
      AppointmentTypeId: null,
      StartDateTimeOfDay: null,
      EndDateTimeOfDay: null,
      IsActivated: false,
      Remark: '',
      DaysCount: undefined,
    },
  });

  const watchStartDate = watch('StartDate');
  const watchEndDate = watch('EndDate');

  const validationResponse = useAbsenceAndCreditTime(
    absenceFields?.AppointmentTypeId ?? 0,
    absenceFields?.StartDate ?? null,
    absenceFields?.StartDateTimeOfDay ?? null,
    absenceFields?.EndDate ?? null,
    absenceFields?.EndDateTimeOfDay ?? null,
    absenceFields?.DaysCount ?? null,
    absenceFields?.Remark ?? null,
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

  useEffect(() => {
    getAppointmentTypesData();
  }, []);

  const onSubmit: SubmitHandler<AbsenceReportFields> = (formData) => {
    setAbsenseFields({
      AppointmentTypeId: formData.AppointmentTypeId,
      StartDate: formData.StartDate,
      StartDateTimeOfDay: formData.StartDateTimeOfDay,
      EndDate: formData.EndDate,
      EndDateTimeOfDay: formData.EndDateTimeOfDay,
      DaysCount: formData.DaysCount,
      Remark: formData.Remark,
      IsActivated: null,
    });

    setFormDataToSave(formData);
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
        },
      ]}
    />
  );

  const timesOfDay = [
    { id: 'FullWorkingDay', time: t('FULL_WORKDAY') },
    { id: 'Morning', time: t('MORNING') },
    { id: 'Afternoon', time: t('AFTERNOON') },
  ];

  return (
    <CustomModal open onClose={onClose} title={t('ABSENCE_REPORT')} actions={modalActions}>
      <Grid container rowSpacing={4} sx={{ pb: 1 }}>
        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2">{t('REASON_FOR_ABSENCE')}</Typography>
          <Controller
            name="AppointmentTypeId"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                error={!!errors.AppointmentTypeId}
                helperText={errors.AppointmentTypeId?.message}
                SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
              >
                {appointmentTypesData?.map(
                  (reason, index) =>
                    reason.Id !== CREDIT_TIME_APPOINTMENT_TYPE_ID && (
                      <MenuItem key={index} value={reason.Id}>
                        {reason.Description}
                      </MenuItem>
                    )
                )}
              </TextField>
            )}
          />
        </Grid>

        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2">{t('STARTING_DETAILS')}</Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
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
                    maxDate={watchEndDate ?? null}
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

            <Controller
              name="StartDateTimeOfDay"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('START_TIME')}
                  select
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
                >
                  {timesOfDay?.map((time, index) => (
                    <MenuItem key={index} value={time.id}>
                      {time.time}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Grid>

        <Grid item mobile={12} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">{t('ENDING_DETAILS')}</Typography>
            <Controller
              name="IsActivated"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.onChange(checked);
                        if (!checked) {
                          setValue('EndDate', null);
                          setValue('EndDateTimeOfDay', null);
                        } else {
                          setValue('EndDate', dayjs());
                        }
                      }}
                      checked={!!field.value}
                      sx={{ py: 0 }}
                    />
                  }
                  label={t('ACTIVATE')}
                  sx={{ mr: 0 }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="EndDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    {...field}
                    value={field.value ?? null}
                    label={t('END_DATE')}
                    minDate={watchStartDate ?? null}
                    format="DD.MM.YYYY"
                    sx={{ width: '100%' }}
                    views={['year', 'month', 'day']}
                    disabled={!watch('IsActivated')}
                    slotProps={{
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.EndDate,
                        helperText: errors.EndDate?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <Controller
              name="EndDateTimeOfDay"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('END_TIME')}
                  select
                  fullWidth
                  disabled={!watch('IsActivated')}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
                >
                  {timesOfDay?.map((time, index) => (
                    <MenuItem key={index} value={time.id}>
                      {time.time}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Grid>

        <Grid item mobile={12}>
          <Controller
            name="DaysCount"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('NUMBER_OF_DAYS')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.DaysCount}
                helperText={errors.DaysCount?.message}
                type="number"
              />
            )}
          />
        </Grid>

        <Grid item mobile={12}>
          <Controller
            name="Remark"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('REMARKS')}
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default AddAbsenceReport;
