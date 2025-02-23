import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Autocomplete, Box, Button } from '@mui/material';
import { type TableData } from '@/src/components/CustomTable/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type Dispatch,
  forwardRef,
  type SetStateAction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  type Manufacturer,
  type ProductGroup,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type OrderDevice } from '@/src/hooks/useTourData/tourData.interface';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getNonEmptyValueOrNull } from '@/src/helpers/sanitizeData';
import dayjs from 'dayjs';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useDispatch } from 'react-redux';
import { getData } from '@/indexedDb';

export interface Props {
  onSubmitForm: (formData: OrderDevice) => void;
  onClose?: () => void;
  data?: TableData;
  fields: Partial<OrderDevice>;
  setFields: Dispatch<SetStateAction<Partial<OrderDevice>>>;
  temporaryApartmentGId: string;
  temporaryObjectId: number;
  openMeasurement: Dispatch<SetStateAction<boolean>>;
  onScanQrCode: () => void;
  addEditOrderDeviceType?: 'edit' | 'add';
}

const AddOrderDevice = forwardRef(
  (
    {
      onSubmitForm,
      data,
      fields,
      setFields,
      temporaryApartmentGId,
      temporaryObjectId,
      openMeasurement,
      onScanQrCode,
      addEditOrderDeviceType = 'add',
    }: Props,
    ref
  ) => {
    const { t } = useTranslation('index');
    const dispatch = useDispatch();

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm<OrderDevice>({
      mode: 'onTouched',
      defaultValues:
        addEditOrderDeviceType === 'add'
          ? {
              Device: fields.Device,
              Model: getNonEmptyValueOrNull(data?.ManufacturerArticleNumber?.toString()),
              SerialNumber: fields.SerialNumber,
              ProductId: getNonEmptyValueOrNull(Number(data?.ProductId)),
              ProductNumber: fields.ProductNumber,
              ASAMMeasurement: fields.ASAMMeasurement,
              InstallationDate: fields.InstallationDate,
              ManufacturerId: getNonEmptyValueOrNull(data?.ManufacturerId?.toString()),
              Manufacturer: String(data?.Manufacturer ?? ''),
              ProductGroupId: Number(data?.ProductGroup),
              ProductGroup: String(data?.ProductGroupText ?? ''),
              TemporaryApartmentGId: temporaryApartmentGId,
              TemporaryObjectId: temporaryObjectId,
            }
          : {
              Device: fields.Device,
              Model: getNonEmptyValueOrNull(data?.Model?.toString()),
              SerialNumber: data?.SerialNumber?.toString(),
              ProductId: getNonEmptyValueOrNull(Number(data?.ProductId)),
              ProductNumber: data?.ProductNumber?.toString(),
              ASAMMeasurement: data?.ASAMMeasurement?.toString(),
              InstallationDate: dayjs(data?.InstallationDate?.toString()),
              ManufacturerId: getNonEmptyValueOrNull(data?.ManufacturerId?.toString()),
              Manufacturer: String(data?.Manufacturer ?? ''),
              ProductGroupId: Number(data?.ProductGroupId),
              ProductGroup: String(data?.ProductGroup ?? ''),
              TemporaryApartmentGId: temporaryApartmentGId,
              TemporaryObjectId: temporaryObjectId,
            },
    });

    const { dataList: manufacturers, getDataList: getManufacturers } =
      useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

    const { dataList: productGroups, getDataList: getProductGroups } =
      useIndexedDbData<ProductGroup>('MasterData', 'ProductGroups');

    const [isOrderDeviceSynced, setIsOrderDeviceSynced] = useState<boolean>(false);

    useEffect(() => {
      getManufacturers();
      getProductGroups();
      fetchUpdatedData();
    }, []);

    const onSubmit: SubmitHandler<OrderDevice> = (formData) => {
      if (isOrderDeviceSynced && addEditOrderDeviceType === 'edit' && data?.OrderDeviceId == null) {
        dispatch(showErrorMessage(t('ORDER_DEVICE_ID_EMPTY')));
        return;
      }

      onSubmitForm(formData);
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    const fetchUpdatedData = async () => {
      const updatedDataResponse = await getData('UpdatedData');
      const insertedRecords =
        updatedDataResponse?.OrderDevicesUpdateRequestModel?.InsertRecords ?? [];
      const insertedIds = insertedRecords.map((data: { UId: string }) => data.UId);
      const isDeviceIdInserted = insertedIds.includes(data?.UId ?? '');

      if (!isDeviceIdInserted) setIsOrderDeviceSynced(true);
    };

    return (
      <Grid container spacing={3} aria-label="Add Order Device Modal">
        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            label={t('MANUFACTURE_ID')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('ManufacturerId')}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            name="Manufacturer"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disabled
                fullWidth
                options={manufacturers}
                value={
                  manufacturers.find((manufacturer) => manufacturer.Name === field.value) ?? null
                }
                getOptionLabel={(manufacturer) => manufacturer.Name ?? ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('MANUFACTURER')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            label={t('PRODUCT_GROUP_ID')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('ProductGroupId')}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            control={control}
            name="ProductGroup"
            render={({ field }) => (
              <Autocomplete
                disabled
                fullWidth
                options={productGroups}
                value={
                  productGroups.find((productGroup) => productGroup.Description === field.value) ??
                  null
                }
                getOptionLabel={(productGroup) => productGroup.Description ?? ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('PRODUCT_GROUP')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            label={t('MODEL')}
            InputLabelProps={{
              shrink: true,
            }}
            {...register('Model')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            type="text"
            label={t('PRODUCT_ID')}
            InputLabelProps={{
              shrink: true,
            }}
            value={watch('ProductId') != null && watch('ProductId') !== 0 ? watch('ProductId') : ''}
            {...register('ProductId')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            required
            label={t('SERIAL_NO')}
            InputLabelProps={{ shrink: true }}
            {...register('SerialNumber', {
              required: true,
              onChange: (e) => {
                setFields((prev) => ({ ...prev, SerialNumber: e.target.value }));
              },
            })}
            {...(errors.SerialNumber && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            required
            label={t('PRODUCT_NO')}
            InputLabelProps={{ shrink: true }}
            {...register('ProductNumber', {
              required: true,
              onChange: (e) => {
                setFields((prev) => ({ ...prev, ProductNumber: e.target.value }));
              },
            })}
            {...(errors.ProductNumber && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Grid>

        <Grid item mobile={6}>
          <Controller
            name="InstallationDate"
            control={control}
            rules={{ required: t('FIELD_IS_REQUIRED') }}
            render={({ field, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label={`${t('INSTALLATION_DATE')} *`}
                  format="DD.MM.YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);
                    setFields((prev) => ({ ...prev, InstallationDate: date }));
                  }}
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item mobile={6}>
          <Box display={'flex'} alignItems={'baseline'} columnGap={2}>
            <TextField
              fullWidth
              disabled
              label={t('ASAM_MEASUREMENT')}
              InputLabelProps={{
                shrink: true,
              }}
              {...register('ASAMMeasurement', {
                onChange: (e) => {
                  setFields((prev) => ({ ...prev, ASAMMeasurement: e.target.value }));
                },
              })}
            />
            <Button
              variant="soft"
              fullWidth
              sx={{ maxWidth: '125px' }}
              onClick={() => {
                openMeasurement(true);
              }}
            >
              {t('MEASURE')}
            </Button>
          </Box>
        </Grid>

        <Grid item mobile={6}>
          <Box display={'flex'} alignItems={'baseline'} columnGap={2}>
            <TextField
              label={t('DEVICE')}
              fullWidth
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              {...register('Device')}
            />
            <Button variant="soft" onClick={onScanQrCode} fullWidth sx={{ maxWidth: '160px' }}>
              {t('SCAN_QR_CODE')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }
);

AddOrderDevice.displayName = 'AddOrderDevice';

export default AddOrderDevice;
