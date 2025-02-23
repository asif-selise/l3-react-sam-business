import { Box, Button, Card, TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { type IRsLineFilterFields } from '../../../../types';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface Props {
  onFilter: (queryValues: IRsLineFilterFields) => void;
}

const RsLineFilter = ({ onFilter }: Props) => {
  const { t } = useTranslation('index');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<IRsLineFilterFields>({
    mode: 'onTouched',
    defaultValues: {
      Challenge: '',
      FromDate: '',
      ToDate: '',
      Remarks: '',
      DoneBy: '',
      ProductGroupNo: null,
      OrderNo: null,
      ManufacturerNo: null,
      RslineId: null,
    },
  });

  const onSubmit: SubmitHandler<IRsLineFilterFields> = async (formData) => {
    onFilter(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleClearAll = () => {
    reset();
  };

  return (
    <Card sx={{ mb: 4 }}>
      <Box p={'24px'}>
        <Box display={'flex'} columnGap={2}>
          <Controller
            name="Challenge"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('CHALLENGE')} variant="outlined" />
            )}
          />

          <Controller
            name="FromDate"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
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
                      error: !!errors.FromDate,
                      helperText: errors.FromDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="ToDate"
            control={control}
            rules={{
              required: t('FIELD_IS_REQUIRED'),
            }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  {...field}
                  value={field.value ?? null}
                  label={t('TO')}
                  format="DD.MM.YYYY"
                  disabled={!watch('FromDate')}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  minDate={watch('FromDate') ?? ''}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!errors.FromDate,
                      helperText: errors.FromDate?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="DoneBy"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('DONE_BY')} variant="outlined" />
            )}
          />
        </Box>

        <Box display={'flex'} columnGap={2} mt={3}>
          <Controller
            name="ProductGroupNo"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('PRODUCT_GROUP_NO')} variant="outlined" />
            )}
          />

          <Controller
            name="OrderNo"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('ORDER_NO')} variant="outlined" />
            )}
          />

          <Controller
            name="ManufacturerNo"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('MANUFACTURER_NO')} variant="outlined" />
            )}
          />

          <Controller
            name="RslineId"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('RSLINE_ID')} variant="outlined" />
            )}
          />
        </Box>

        <Box display={'flex'} mt={3}>
          <Controller
            name="Remarks"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('Remarks')} variant="outlined" />
            )}
          />
        </Box>

        <Box mt={3} display={'flex'} justifyContent={'flex-end'} columnGap={3}>
          <Button
            color="error"
            variant="outlined"
            startIcon={<ClearIcon />}
            disabled={!isDirty}
            onClick={handleClearAll}
          >
            {t('CLEAR_ALL')}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleSubmitForm}
          >
            {t('FILTER')}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default RsLineFilter;
