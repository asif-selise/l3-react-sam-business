import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, Grid, TextField, MenuItem, Box } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { type WoodOrder } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type WoodOrderColorDefinition,
  type WoodOrderManufacturer,
  type WoodOrderManufacturerKitchen,
  type WoodOrderManufacturerLabelPhoto,
} from '@/src/hooks/useMasterData/masterData.interface';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getUniqueNumber } from '@/src/helpers/generateID';

interface Props {
  type: 'add' | 'edit';
  editData?: WoodOrder;
  onClose: (action: 'close') => void;
  onSubmitForm: (formData: WoodOrder) => void;
  samOfferUId: string | null;
  samOfferId: number | null;
}

const UpsertWoodItem = ({
  onSubmitForm,
  onClose,
  type,
  editData,
  samOfferUId,
  samOfferId,
}: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);
  const technicianDataResponse = useTechnicianData();

  const { dataList: manufacturerList, getDataList: getManufacturerList } =
    useIndexedDbData<WoodOrderManufacturer>('MasterData', 'WoodOrderManufacturers');

  const { dataList: colorDefinitionList, getDataList: getColorDefinitionList } =
    useIndexedDbData<WoodOrderColorDefinition>('MasterData', 'WoodOrderColorDefinitions');

  const { dataList: manufacturerKitchenList, getDataList: getManufacturerKitchenList } =
    useIndexedDbData<WoodOrderManufacturerKitchen>('MasterData', 'WoodOrderManufacturerKitchens');

  const { dataList: manufacturerLabelPhotoList, getDataList: getManufacturerLabelPhotoList } =
    useIndexedDbData<WoodOrderManufacturerLabelPhoto>(
      'MasterData',
      'WoodOrderManufacturerLabelPhotos'
    );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WoodOrder>({
    mode: 'onTouched',
    defaultValues:
      type === 'add'
        ? {
            UId: uuidv4(),
            OrderId: id,
            WoodOrderId: getUniqueNumber(),
            Remark: null,
            CreatedOn: dayjs().toISOString(),
            CreatedBy: technicianDataResponse.data?.systemUser,
            ChangedBy: null,
            OrderedOn: null,
            OrderedBy: null,
            SamOfferId: samOfferId,
            SamOfferUId: samOfferUId,
            ColorDefinition: null,
            CompletedOrDeactivated: false,
            TechnicianEmployeeNumber: technicianDataResponse.data?.technicianEmployeeNumber,
            ManufacturerKitchen: null,
            PhotoManufacturerLabelMade: null,
          }
        : {
            UId: editData?.UId,
            OrderId: editData?.OrderId,
            WoodOrderId: editData?.WoodOrderId,
            SamOfferId: editData?.SamOfferId,
            SamOfferUId: editData?.SamOfferUId,
            Remark: editData?.Remark,
            WoodOrderManufacturerId: editData?.WoodOrderManufacturerId,
            CreatedOn: editData?.CreatedOn,
            CreatedBy: editData?.CreatedBy,
            OrderedOn: editData?.OrderedOn,
            OrderedBy: editData?.OrderedBy,
            CompletedOrDeactivated: editData?.CompletedOrDeactivated,
            ColorDefinition: editData?.ColorDefinition,
            ManufacturerKitchen: editData?.ManufacturerKitchen,
            PhotoManufacturerLabelMade: editData?.PhotoManufacturerLabelMade,
          },
  });

  const onSubmit = (formData: WoodOrder): void => {
    onSubmitForm(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    getManufacturerList().then();
    getColorDefinitionList().then();
    getManufacturerKitchenList().then();
    getManufacturerLabelPhotoList().then();
  }, []);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            onClose('close');
          },
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
      variant="md"
      open={true}
      title={type === 'add' ? t('ADD_NEW_WOOD_ORDER_ITEM') : t('EDIT_WOOD_ORDER_ITEM')}
      actions={modalActions}
      onClose={() => {
        onClose('close');
      }}
    >
      <Grid container rowGap={3} aria-label="Edit Device Details Modal">
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <TextField fullWidth disabled label={t('NO_ID')} {...register('SamOfferId')} />
          <TextField fullWidth disabled label={t('WOOD_ORDER_ID')} {...register('WoodOrderId')} />

          <Controller
            control={control}
            name="WoodOrderManufacturerId"
            rules={{ required: t('FIELD_IS_REQUIRED') }}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  {...field}
                  required
                  select
                  label={t('CARPENTER')}
                  variant="outlined"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                >
                  {manufacturerList.map((item, index) => (
                    <MenuItem key={item.Id} value={item.Id}>
                      {item.Address}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>

        <Box display={'flex'} columnGap={2} width={'100%'}>
          <Controller
            name="OrderedOn"
            control={control}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={value ? dayjs(value) : null}
                  onChange={(date) => {
                    onChange(date ? date.toISOString() : null);
                  }}
                  label={t('ORDERED_ON')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: true },
                      error: !!errors.OrderedOn,
                      helperText: errors.OrderedOn?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <TextField fullWidth label={t('ORDERED_FROM')} {...register('OrderedBy')} />
          <Controller
            control={control}
            name="ColorDefinition"
            render={({ field }) => {
              return (
                <TextField
                  inputProps={{ 'aria-label': 'Color Definition' }}
                  {...field}
                  select
                  label={t('COLOR_DEFINITION')}
                  variant="outlined"
                  fullWidth
                >
                  {colorDefinitionList.map((item, index) => (
                    <MenuItem key={index + 2} value={item.ColorDefinition ?? ''}>
                      {item.ColorDefinition}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <Controller
            name="CreatedOn"
            control={control}
            rules={{ required: t('FIELD_IS_REQUIRED') }}
            render={({ field: { value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  disabled
                  value={value ? dayjs(value) : null}
                  label={t('CREATED_ON')}
                  format="DD.MM.YYYY"
                  sx={{ width: '100%' }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      required: true,
                      InputLabelProps: { shrink: true },
                      error: !!errors.CreatedOn,
                      helperText: errors.CreatedOn?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <TextField disabled fullWidth label={t('CREATED_BY')} {...register('CreatedBy')} />
          <Controller
            control={control}
            name="ManufacturerKitchen"
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  select
                  label={t('MANUFACTURER_OF_THE_KITCHEN')}
                  variant="outlined"
                  fullWidth
                >
                  {manufacturerKitchenList.map((item, index) => (
                    <MenuItem key={index + 2} value={item.ManufacturerKitchen ?? ''}>
                      {item.ManufacturerKitchen}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>

        <Box display={'flex'} columnGap={2} width={'100%'}>
          <TextField disabled fullWidth label={t('MA')} {...register('TechnicianEmployeeNumber')} />
          <TextField
            inputProps={{ 'aria-label': 'Remarks' }}
            fullWidth
            label={t('REMARKS')}
            {...register('Remark')}
          />
          <Controller
            control={control}
            name="PhotoManufacturerLabelMade"
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  select
                  label={t('TAKEN....LABEL')}
                  variant="outlined"
                  fullWidth
                >
                  {manufacturerLabelPhotoList.map((item, index) => (
                    <MenuItem key={index + 2} value={item.ManufacturerLabelPhoto ?? ''}>
                      {item.ManufacturerLabelPhoto}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={type === 'add' ? false : !!editData?.CompletedOrDeactivated}
              {...register('CompletedOrDeactivated')}
            />
          }
          label={t('DONE_OR_DEACTIVATED')}
          labelPlacement="start"
        />
      </Grid>
    </CustomModal>
  );
};

export default UpsertWoodItem;
