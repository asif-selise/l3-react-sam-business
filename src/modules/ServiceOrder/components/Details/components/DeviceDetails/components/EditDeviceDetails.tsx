import { Autocomplete, Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useEffect, useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Controller, useForm } from 'react-hook-form';
import { type IEditDeviceData } from '../DeviceDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type ProductGroup,
  type Manufacturer,
} from '@/src/hooks/useMasterData/masterData.interface';
import { useSelector } from '@/src/redux/store';

interface Props {
  open: boolean;
  onDiscard: () => void;
  onSaveChanges: (formData: IEditDeviceData) => void;
  data: IEditDeviceData;
}

const EditDeviceDetails = ({ open, onDiscard, onSaveChanges, data }: Props) => {
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [installationDate, setInstallationDate] = useState<Date | null>(data.installationDate);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<IEditDeviceData>({
    mode: 'onTouched',
    defaultValues: {
      ...data,
    },
  });

  const { dataList: manufacturerList, getDataList: getManufacturerList } =
    useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

  const { dataList: productGroupList, getDataList: getProductGroupList } =
    useIndexedDbData<ProductGroup>('MasterData', 'ProductGroups');

  const onSubmit = (formData: IEditDeviceData): void => {
    onSaveChanges({ ...formData, installationDate });
  };

  const bandungOptions = [
    {
      id: 'links',
      value: t('LINKS'),
    },
    {
      id: 'rechts',
      value: t('RECHTS'),
    },
    {
      id: 'top',
      value: t('TOP'),
    },
  ];

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleSetTodayDate = () => {
    setInstallationDate(new Date());
  };

  useEffect(() => {
    getManufacturerList();
    getProductGroupList();
  }, []);

  useEffect(() => {
    if (manufacturerList.length > 0 && data.manufacturer) {
      const defaultManufacturer = manufacturerList.find(
        (manufacturer) => manufacturer.Id === data.manufacturer
      );
      setSelectedManufacturer(defaultManufacturer ?? null);
    }
  }, [manufacturerList, data]);

  useEffect(() => {
    if (data.installationDate) {
      setInstallationDate(new Date(data.installationDate));
    }
  }, [data]);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onDiscard,
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: handleSubmitForm,
          disabled: isSoReadOnly,
        },
      ]}
    />
  );

  return (
    <CustomModal
      title={t('EDIT_DEVICE_DETAILS')}
      open={open}
      onClose={onDiscard}
      actions={modalActions}
    >
      <Grid container rowGap={3} aria-label="Edit Device Details Modal">
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <Controller
            name="manufacturer"
            control={control}
            rules={{ required: t('FIELD_IS_REQUIRED') }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                fullWidth
                disabled={isSoReadOnly}
                options={manufacturerList}
                value={selectedManufacturer}
                getOptionLabel={(manufacturer) => manufacturer.Name ?? ''}
                onChange={(event, newValue) => {
                  setSelectedManufacturer(newValue);
                  field.onChange(newValue ? newValue.Id : '');
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label={t('BRAND')}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="bandung"
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  select
                  disabled={isSoReadOnly}
                  label={t('BANDUNG')}
                  variant="outlined"
                  value={getValues('bandung') ?? ''}
                  fullWidth
                >
                  {bandungOptions.map((item, index) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.value}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
          <Controller
            control={control}
            name="productGroup"
            rules={{ required: t('FIELD_IS_REQUIRED') }}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  {...field}
                  required
                  select
                  disabled={isSoReadOnly}
                  label={t('PRODUCT_GROUP')}
                  variant="outlined"
                  value={getValues('productGroup') ?? ''}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                >
                  {productGroupList.map((item, index) => (
                    <MenuItem key={item.Id} value={item.Id}>
                      {item.Description}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>

        <Box display={'flex'} columnGap={2} width={'100%'}>
          <TextField
            fullWidth
            required
            label={t('MODEL')}
            disabled={isSoReadOnly}
            {...register('model', { required: true })}
            {...(errors.model && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />

          <TextField
            fullWidth
            required
            label={t('SERIAL_NUMBER')}
            disabled={isSoReadOnly}
            inputProps={{ 'aria-label': 'Serial Number' }}
            {...register('serialNumber', { required: true })}
            {...(errors.serialNumber && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
          <TextField
            fullWidth
            required
            label={t('PRODUCT_NO')}
            disabled={isSoReadOnly}
            {...register('productNo', { required: true })}
            {...(errors.productNo && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <TextField
            disabled
            fullWidth
            label={t('OPERATION_HOURS')}
            inputProps={{ 'aria-label': 'Operation Hours' }}
            {...register('operationHours')}
          />
          <TextField
            fullWidth
            required
            disabled={isSoReadOnly}
            label={t('PRODUCTION_DATE')}
            {...register('productionDate', { required: true })}
            {...(errors.productionDate && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <TextField disabled={isSoReadOnly} fullWidth label={t('COLOR')} {...register('color')} />
          <Box width={'100%'} display={'flex'} alignItems={'baseline'} columnGap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="installationDate"
                control={control}
                rules={{ required: t('FIELD_IS_REQUIRED') }}
                render={({ field, fieldState: { error } }) => (
                  <DesktopDatePicker
                    sx={{ width: '100%' }}
                    disabled={isSoReadOnly}
                    format="dd.MM.yyyy"
                    label={t('INSTALLATION_DATE')}
                    maxDate={new Date()}
                    value={installationDate}
                    views={['year', 'month', 'day']}
                    onChange={(newDate) => {
                      setInstallationDate(newDate);
                      field.onChange(newDate);
                    }}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: !!error,
                        helperText: error ? error.message : null,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Button
              variant="soft"
              disabled={isSoReadOnly}
              onClick={handleSetTodayDate}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
                paddingRight: '8px',
                paddingLeft: '8px',
              }}
            >
              {t('TODAY')}
            </Button>
          </Box>
        </Box>
        <TextField
          fullWidth
          disabled
          multiline={true}
          label={t('SERVICE_ORDER_IMPORTANT_INFO')}
          {...register('serviceOrderDetails')}
        />
      </Grid>
    </CustomModal>
  );
};

export default EditDeviceDetails;
