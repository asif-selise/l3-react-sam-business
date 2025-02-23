import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';
import { type IDataMenuSamOrdersRequestParams } from '../../../../types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';

interface Props {
  onFilter: (queryValues: IDataMenuSamOrdersRequestParams) => void;
}

const ViewOrdersFilter = ({ onFilter }: Props) => {
  const { t } = useTranslation('index');

  const {
    dataList: manufacturerList,
    getDataList: getManufacturerList,
    isLoading: manufacturerIsLoading,
  } = useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IDataMenuSamOrdersRequestParams>({
    mode: 'onTouched',
    defaultValues: {
      BookedState: false,
      SamOrderId: '',
      ManufacturerName: '',
      ManufacturerArticleNumber: '',
      ProductDescription: '',
      OrderId: '',
    },
  });

  const onSubmit: SubmitHandler<IDataMenuSamOrdersRequestParams> = async (formData) => {
    onFilter(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleClearAll = () => {
    reset();
    setSelectedManufacturer(null);
  };

  useEffect(() => {
    getManufacturerList();
  }, []);

  return (
    <Card sx={{ mb: 4 }}>
      {!manufacturerIsLoading && (
        <Box p={'24px'}>
          <Box display={'flex'} columnGap={2}>
            <Controller
              name="SamOrderId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label={t('ORDER_NO_S7000')} variant="outlined" />
              )}
            />

            <Controller
              name="ManufacturerName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  fullWidth
                  options={manufacturerList}
                  value={selectedManufacturer}
                  getOptionLabel={(manufacturer) => manufacturer.NameWithoutNumberAtTheEnd ?? ''}
                  onChange={(event, newValue) => {
                    setSelectedManufacturer(newValue);
                    field.onChange(newValue ? newValue.NameWithoutNumberAtTheEnd : '');
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.Id}>
                      {option.NameWithoutNumberAtTheEnd}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('MANUFACTURER')}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="OrderId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label={t('SO')} variant="outlined" />
              )}
            />
          </Box>

          <Box display={'flex'} justifyContent="space-between" columnGap={2} mt={3}>
            <Controller
              name="ManufacturerArticleNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('ARTICLE_NUMBER')}
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              )}
            />
            <Controller
              name="ProductDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('ARTICLE_REFERENCE')}
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              )}
            />
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Controller
                name="BookedState"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={t('OPEN_ORDERS')}
                  />
                )}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  disabled={!isDirty}
                  onClick={handleClearAll}
                >
                  <OverflowTooltip variant="subtitle2" text={t('CLEAR_ALL')} />
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
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default ViewOrdersFilter;
