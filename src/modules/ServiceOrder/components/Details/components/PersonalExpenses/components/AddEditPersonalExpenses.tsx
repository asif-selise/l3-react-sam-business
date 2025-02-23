import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect } from 'react';
import { type NoSecondCourseReasons } from '@/src/hooks/useMasterData/masterData.interface';
import { getUniqueNumber } from '@/src/helpers/generateID';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  type Clocks,
  type PersonalEffort,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { MobileTimePicker } from '@mui/x-date-pickers';
import {
  dateTime1900toISO8601,
  getDateTime1900,
} from '@/src/modules/ServiceOrder/components/Details/KVEstimatedCost/utils/helpers';
import { minuteToMilliseconds, toUTCDateTime } from '@/src/helpers/formatDate';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { isDefined } from '@/src/helpers/genericFunctions';
import {
  convertFromMillis,
  convertToUtcDate,
  convertToUtcDateTime,
  convertToUtcTime,
  getMillis,
} from '@/src/helpers/formatDateByLuxon';

interface Props {
  onSubmitForm: (formData: PersonalEffort) => void;
  onClose: () => void;
  type: 'add' | 'edit';
  data?: PersonalEffort;
}

const AddEditPersonalExpenses = ({ onSubmitForm, onClose, data, type }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const id = useSelector((state: any) => state.serviceOrder.id);
  const { data: technicianData } = useTechnicianData();

  const { dataList: noSecondCourseReasonsData, getDataList: getNoSecondCourseReasonsData } =
    useIndexedDbData<NoSecondCourseReasons>('MasterData', 'NoSecondCourseReasons');

  const { dataList: clocks, getDataList: getClocks } = useIndexedDbData<Clocks>(
    'TourPlanData',
    'Clocks'
  );

  const { customFilteredDataList: soDetailsList, getCustomFilteredDataList: getSoDetailsList } =
    useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  useEffect(() => {
    getNoSecondCourseReasonsData().then();
    getClocks().then();
    getSoDetailsList((it) => ![12, 17, 22].includes(it.Status)).then();
  }, []);

  const {
    customFilteredDataList: personalExpensesData,
    getCustomFilteredDataList: fetchPersonalExpenses,
  } = useIndexedDbData<PersonalEffort>('TourPlanData', 'PersonalEfforts');

  useEffect(() => {
    fetchPersonalExpenses(
      (it) =>
        it.TechnicianEmployeeNumber === technicianData?.technicianEmployeeNumber &&
        soDetailsList.some((x) => x.OrderId === it.OrderId)
    ).then();
  }, [id, technicianData, soDetailsList]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PersonalEffort>({
    mode: 'onTouched',
    defaultValues:
      type === 'edit'
        ? {
            UId: data?.UId,
            PersonalEffortId: data?.PersonalEffortId,
            OrderId: data?.OrderId,
            Date: dayjs(data?.Date),
            TechnicianEmployeeNumber: data?.TechnicianEmployeeNumber,
            TechnicianName: data?.TechnicianName,
            Start: dayjs(dateTime1900toISO8601(data?.Start as string)),
            End: dayjs(dateTime1900toISO8601(data?.End as string)),
            TravelTime: data?.TravelTime,
            Code: data?.Code,
            NoSecondWayReason: data?.NoSecondWayReason ?? 0,
            WorkFromHome: data?.WorkFromHome,
          }
        : {
            UId: uuidv4(),
            PersonalEffortId: getUniqueNumber(),
            OrderId: Number(id),
            Date: dayjs(),
            TechnicianEmployeeNumber: technicianData?.technicianEmployeeNumber,
            TechnicianName: technicianData?.fullName,
            TravelTime: null,
            Code: null,
            NoSecondWayReason: null,
            WorkFromHome: false,
          },
  });

  const watchStart = watch('Start');
  const watchEnd = watch('End');

  const filteredReasons = noSecondCourseReasonsData?.filter((reason) => reason.IsActive);

  const overlapOfPersonnelExpenses = (formData: PersonalEffort) => {
    if (!isDefined(formData.Date) || !isDefined(formData.Start) || !isDefined(formData.End)) {
      return true;
    }

    const overlaps: PersonalEffort[] = [];

    for (const it of personalExpensesData) {
      if (
        !isDefined(it.Start) ||
        !isDefined(formData.End) ||
        it.PersonalEffortId === formData.PersonalEffortId ||
        convertToUtcDate(formData.Date) !== convertToUtcDate(it.Date)
      ) {
        continue;
      }

      const adjustedStartMilliseconds =
        getMillis(formData.Start) - (formData.TravelTime ?? 0) * minuteToMilliseconds;
      const adjustedStart = convertFromMillis(adjustedStartMilliseconds);

      const adjustedPersonalExpenseStartMilliseconds =
        getMillis(it.Start) - (it.TravelTime ?? it.CalculatedHW ?? 0) * minuteToMilliseconds;
      const adjustedPersonalExpenseStart = convertFromMillis(
        adjustedPersonalExpenseStartMilliseconds
      );

      const adjustedEnd = convertToUtcDateTime(formData.End);
      const adjustedPersonalExpenseEnd = convertToUtcDateTime(it.End);

      const isOverlap =
        adjustedStart < adjustedPersonalExpenseEnd && adjustedEnd > adjustedPersonalExpenseStart;

      if (isOverlap) {
        overlaps.push(it);
      }
    }

    if (overlaps.length > 0) {
      const overlap = overlaps[0];
      dispatch(
        showErrorMessage(
          t('OVERLAP_IN_PERSONAL_EXPENSES', {
            TechnicianEmployeeNumber: technicianData?.technicianEmployeeNumber,
            ServiceOrderId: id,
            FormDataDate: convertToUtcDate(formData.Date),
            FormDataStart: convertToUtcTime(formData.Start),
            FormDataEnd: convertToUtcTime(formData.End),
            FormDataTravelTime: formData.TravelTime ?? 0,
            OverlapTechnicianEmployeeNumber: overlap.TechnicianEmployeeNumber,
            OverlapOrderId: overlap.OrderId,
            OverlapDate: convertToUtcDate(overlap.Date),
            OverlapStart: convertToUtcTime(overlap.Start),
            OverlapEnd: convertToUtcTime(overlap.End),
            OverlapTravelTime: overlap.TravelTime ?? 0,
          })
        )
      );

      return false;
    }

    return true;
  };

  const overlapOfZes = (formData: PersonalEffort) => {
    if (!isDefined(formData.Date) || !isDefined(formData.Start) || !isDefined(formData.End)) {
      return true;
    }

    const overlaps: Clocks[] = [];

    for (const clock of clocks) {
      const clockOut = clock.Clockouttimestamp;
      const clockIn = clock.Clockintimestamp;

      if (!isDefined(clockIn) || !isDefined(clockOut)) {
        return false;
      }

      const adjustedStart = convertFromMillis(
        getMillis(formData.Start) - (formData.TravelTime ?? 0) * minuteToMilliseconds
      );

      const adjustedClockIn = convertFromMillis(
        getMillis(clockIn) - (formData.TravelTime ?? 0) * minuteToMilliseconds
      );

      const isClockOutConditionMet = adjustedStart < convertToUtcDateTime(clockOut);
      const isClockInConditionMet = convertToUtcDateTime(formData.End) > adjustedClockIn;

      const isOverlap = isClockOutConditionMet && isClockInConditionMet;

      if (isOverlap) {
        overlaps.push(clock);
      }
    }

    if (overlaps.length > 0) {
      const overlap = overlaps[0];

      dispatch(
        showErrorMessage(
          t('OVERLAP_IN_ZES', {
            TechnicianEmployeeNumber: technicianData?.technicianEmployeeNumber,
            ServiceOrderId: id,
            FormDataDate: convertToUtcDate(formData.Date),
            FormDataStart: convertToUtcTime(formData.Start),
            FormDataEnd: convertToUtcTime(formData.End),
            FormDataTravelTime: formData.TravelTime ?? 0,
            OverlapClockintimestamp: isDefined(overlap.Clockintimestamp)
              ? convertToUtcTime(overlap.Clockintimestamp)
              : null,
            OverlapClockouttimestamp: isDefined(overlap.Clockouttimestamp)
              ? convertToUtcTime(overlap.Clockouttimestamp)
              : null,
          })
        )
      );

      return false;
    }

    return true;
  };

  const onSubmit: SubmitHandler<PersonalEffort> = (formData) => {
    const formatedFormData = {
      ...formData,
      TravelTime: formData.TravelTime === 0 ? null : formData.TravelTime,
      NoSecondWayReason: formData.NoSecondWayReason === 0 ? null : formData.NoSecondWayReason,
      Date: type === 'edit' ? String(data?.Date) : String(toUTCDateTime(formData.Date)),
      Start: getDateTime1900(formData.Start),
      End: getDateTime1900(formData.End),
    };
    const validations = [overlapOfPersonnelExpenses, overlapOfZes];

    if (validations.every((validate) => validate(formatedFormData))) {
      switch (type) {
        case 'edit':
          onSubmitForm(formatedFormData);
          break;
        default:
          onSubmitForm(formatedFormData);
      }
    }
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const validateTime = () => {
    if (watchStart && watchEnd && dayjs(watchStart).isAfter(dayjs(watchEnd))) {
      setError('Start', { type: 'manual', message: t('START_TIME_MUST_BE_BEFORE_END_TIME') });
      setError('End', { type: 'manual', message: t('END_TIME_MUST_BE_AFTER_START_TIME') });
      return false;
    } else {
      clearErrors(['Start', 'End']);
      return true;
    }
  };

  useEffect(() => {
    validateTime();
  }, [watchStart, watchEnd]);

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
    <CustomModal
      open={true}
      title={type === 'edit' ? t('PERSONAL_EXPENSES') : t('ADD_NEW_EXPENSE')}
      actions={modalActions}
      onClose={onClose}
    >
      <Grid container spacing={3}>
        <Grid item mobile={12}>
          <Controller
            name="Date"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  disabled
                  value={field.value ?? null}
                  label={t('DATE')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      required: true,
                      InputLabelProps: { shrink: true },
                      error: !!errors.Date,
                      helperText: errors.Date?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            type="number"
            disabled
            required
            {...register('TechnicianEmployeeNumber', { required: true })}
            label={t('TECHNICIAN_NUMBER')}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...(errors.TechnicianEmployeeNumber && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            required
            disabled
            {...register('TechnicianName', { required: true })}
            label={t('TECHNICIAN_NAME')}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...(errors.TechnicianName && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            name="Start"
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
                  label={t('FROM')}
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
                      required: true,
                      InputLabelProps: { shrink: true },
                      error: !!errors.Start,
                      helperText: errors.Start?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            name="End"
            control={control}
            rules={{
              validate: validateTime,
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  orientation="landscape"
                  {...field}
                  value={field.value ?? null}
                  label={t('UNTIL')}
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
                      required: true,
                      InputLabelProps: { shrink: true },
                      error: !!errors.End,
                      helperText: errors.End?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            type="number"
            {...register('TravelTime', {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
            label={t('TRAVEL_TIME')}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            disabled
            label={t('CODE')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('Code')}
          />
        </Grid>

        <Grid item mobile={12}>
          <TextField
            required
            {...register('NoSecondWayReason', { required: true })}
            {...(errors.NoSecondWayReason && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
            defaultValue={getValues('NoSecondWayReason')}
            label={t('SECOND_CHECK_REASON')}
            fullWidth
            select
            InputLabelProps={{
              shrink: true,
            }}
          >
            {filteredReasons?.map((reason) => (
              <MenuItem key={reason.Id} value={reason.Id}>
                {reason.Reason}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item mobile={12}>
          <Controller
            name="WorkFromHome"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={!!field.value} />}
                label={t('WORK_FROM_HOME')}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default AddEditPersonalExpenses;
