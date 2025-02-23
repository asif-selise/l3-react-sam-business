import { useTranslation } from 'react-i18next';
import AbsenceCreditOverviewTable from './AbsenceCreditOverviewTable/AbsenceCreditOverviewTable';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { type AppointmentType, type Appointment } from '@/src/hooks/useTourData/tourData.interface';
import { Controller, useForm } from 'react-hook-form';
import { ClearIcon, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type AbsenceCreditTimeFilterFields } from '../../types';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';

interface Props {
  data: Appointment[];
  isLoading: boolean;
  onClose: () => void;
  // onEditClicked: (appointmentId: number, appointmentTypeId: number) => void;
}

const AbsenceCreditOverview = ({ data, isLoading, onClose }: Props) => {
  const { t } = useTranslation('index');

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

  const { dataList: appointmentTypesData, getDataList: getAppointmentTypesData } =
    useIndexedDbData<AppointmentType>('TourPlanData', 'AppointmentTypes');

  const [absenceCreditTimeDataList, setAbsenceCreditTimeDataList] = useState<Appointment[]>(data);

  const {
    control,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<AbsenceCreditTimeFilterFields>({
    mode: 'onTouched',
    defaultValues: {
      AppointmentTypeId: null,
      StartDate: null,
      EndDate: null,
      Remark: '',
    },
  });

  useEffect(() => {
    getAppointmentTypesData();
  }, []);

  const handleApplyFilter = () => {
    const values = getValues();
    const AppointmentTypeId = values.AppointmentTypeId;
    const StartDate = values.StartDate;
    const EndDate = values.EndDate;
    const Remark = values.Remark;

    const filteredData = data.filter((appointment) => {
      return (
        (AppointmentTypeId === null || appointment.AppointmentTypeId === AppointmentTypeId) &&
        (StartDate === null ||
          dayjs(appointment.StartDate).isAfter(dayjs(StartDate)) ||
          dayjs(appointment.StartDate).isSame(dayjs(StartDate))) &&
        (EndDate === null ||
          dayjs(appointment.EndDate).isBefore(dayjs(EndDate)) ||
          dayjs(appointment.EndDate).isSame(dayjs(EndDate))) &&
        (Remark === '' || (!!Remark && appointment.Remark?.includes(Remark)))
      );
    });
    setAbsenceCreditTimeDataList(filteredData);
  };

  return (
    <CustomModal
      open
      onClose={onClose}
      title={t('ABSENCE_REPORTS_AND_CREDIT_NOTES_OVERVIEW')}
      actions={modalActions}
      variant="md"
    >
      <Box sx={{ pb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Controller
            name="AppointmentTypeId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label={t('REASON_FOR_ABSENCE')}
                error={!!errors.AppointmentTypeId}
                helperText={errors.AppointmentTypeId?.message}
                SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
                InputProps={{
                  sx: {
                    height: '53px',
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {appointmentTypesData?.map((reason, index) => (
                  <MenuItem key={index} value={reason.Id}>
                    {reason.Description}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="Remark"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('REMARKS')}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <Controller
            name="StartDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  value={field.value ?? null}
                  label={t('FROM')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!errors.StartDate,
                      helperText: errors.StartDate?.message ?? '',
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="EndDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  value={field.value ?? null}
                  label={t('UNTIL')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!errors.StartDate,
                      helperText: errors.StartDate?.message ?? '',
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            color="error"
            variant="outlined"
            startIcon={<ClearIcon />}
            disabled={!isDirty}
            onClick={() => {
              reset();
            }}
          >
            {t('CLEAR_ALL')}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleApplyFilter}
          >
            {t('FILTER')}
          </Button>
        </Box>
      </Box>
      <AbsenceCreditOverviewTable data={absenceCreditTimeDataList} isLoading={isLoading} />
    </CustomModal>
  );
};

export default AbsenceCreditOverview;
