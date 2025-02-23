import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import CustomDropdown from '@/src/components/CustomDropdown/CustomDropdown';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type QrFilterParams } from '@/src/hooks/useQrCodeSearch/types';

interface Props {
  anchorEl: HTMLElement;
  onClose: () => void;
  onApply: (filterData: QrFilterParams) => void;
  filterData: QrFilterParams;
}

const FilterQRCode = ({ anchorEl, onClose, onApply, filterData }: Props) => {
  const { t } = useTranslation('index');

  const { register, control, handleSubmit, setValue, watch } = useForm<QrFilterParams>({
    mode: 'onTouched',
    defaultValues: filterData,
  });

  const onSubmit: SubmitHandler<QrFilterParams> = (formData) => {
    onApply(formData);
  };

  return (
    <CustomDropdown
      anchorEl={anchorEl}
      onClose={onClose}
      header={{
        title: t('FILTERS'),
        button: { label: t('APPLY'), action: handleSubmit(onSubmit) },
      }}
    >
      <Controller
        name="IsInactive"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={!!field.value} />}
            label={t('SHOW_INACTIVE_DEVICES')}
          />
        )}
      />
      <TextField
        label={t('TOP')}
        value={watch('TopRecordNumber')}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) {
            setValue('TopRecordNumber', value);
          }
        }}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label={t('OBJECT_ID')}
        value={watch('ObjectId')}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) {
            setValue('ObjectId', value);
          }
        }}
        disabled
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label={t('WHG_ID')}
        value={watch('ApartmentId')}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!isNaN(value)) {
            setValue('ApartmentId', value);
          }
        }}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        {...register('SerialNumber', { required: true })}
        label={t('SN')}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        error={!watch('SerialNumber')}
        helperText={!watch('SerialNumber') ? t('SERIAL_NUMBER_IS_REQUIRED') : ''}
      />
    </CustomDropdown>
  );
};

export default FilterQRCode;
