import { Box, Button, Card, Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { type ISak7000FilterFields } from '../../../../types';

interface Props {
  onFilter: (queryValues: ISak7000FilterFields) => void;
}

const Sak7000Filter = ({ onFilter }: Props) => {
  const { t } = useTranslation('index');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ISak7000FilterFields>({
    mode: 'onTouched',
    defaultValues: {
      TopRecordNumber: '',
      RsLine: false,
      Avor: false,
      SearchMode: '',
      Filter: '',
    },
  });

  const onSubmit: SubmitHandler<ISak7000FilterFields> = async (formData) => {
    onFilter(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleClearAll = () => {
    reset();
  };

  const searchMode = [
    { id: 0, time: 'Worte' },
    { id: 1, time: 'Wortteile' },
    { id: 2, time: 'AehnlicheWorte' },
  ];

  return (
    <Card sx={{ mb: 4 }}>
      <Box p={'24px'}>
        <Box display={'flex'} columnGap={3}>
          <Controller
            name="TopRecordNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('TOP')} variant="outlined" />
            )}
          />

          <Controller
            name="Filter"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('SEARCH')} variant="outlined" />
            )}
          />

          <Controller
            name="SearchMode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('SEARCH_MODE')}
                select
                fullWidth
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
              >
                {searchMode?.map((time, index) => (
                  <MenuItem key={index} value={time.id}>
                    {time.time}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box display={'flex'} columnGap={3} mt={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Controller
              name="RsLine"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={t('RS_LINE')}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Controller
              name="Avor"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={t('AVOR')}
                />
              )}
            />
          </Box>
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

export default Sak7000Filter;
