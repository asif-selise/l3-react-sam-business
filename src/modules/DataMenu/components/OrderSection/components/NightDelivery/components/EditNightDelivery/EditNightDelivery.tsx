import { formatCurrency } from '@/src/helpers/formatCurrency';
import { getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type NightDeliveryData } from '@/src/hooks/useGetPostOrderOrGoodsReceiptData/types';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  data: NightDeliveryData;
  onSave: (data: NightDeliveryData) => void;
}

const EditNightDelivery = forwardRef(({ data, onSave }: Props, ref) => {
  const { t } = useTranslation('index');

  const { handleSubmit, control } = useForm<NightDeliveryData>({
    mode: 'onTouched',
    defaultValues: {
      ...data,
    },
  });

  const onSubmit: SubmitHandler<NightDeliveryData> = async (formData) => {
    onSave(formData);
  };

  useImperativeHandle(ref, () => ({
    handleSubmitForm: () => {
      handleSubmit(onSubmit)();
    },
  }));

  return (
    <Box display={'flex'} flexDirection={'column'} rowGap={2}>
      <Box display={'flex'} columnGap={2}>
        <TextField
          disabled
          fullWidth
          label={t('BEST_DAT')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(getDate(data.OrderedDate?.toString()))}
        />
        <TextField
          disabled
          fullWidth
          label={t('BEST_NR_S7000')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.SamOrderId)}
        />
        <TextField
          aria-label="SO NR"
          disabled
          fullWidth
          label={t('SO_NR')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.OrderId)}
        />
      </Box>
      <Box display={'flex'} columnGap={2}>
        <TextField
          disabled
          fullWidth
          label={t('TOUR_AM')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(getDate(data.AppointmentDate?.toString()))}
        />
        <TextField
          disabled
          fullWidth
          label={t('ANZ_BOOKED')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ReceivedQuantity)}
        />

        <TextField
          disabled
          fullWidth
          label={t('HERST_NR')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ManufacturerId)}
        />
      </Box>
      <Box display={'flex'} columnGap={2}>
        <TextField
          disabled
          fullWidth
          label={t('MANUFACTURER')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ManufacturerName)}
        />
        <TextField
          disabled
          fullWidth
          label={t('ARTICLE_NO')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ManufacturerArticleNumber)}
        />
        <TextField
          disabled
          fullWidth
          label={t('PRODUCT_DESCRIPTION')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ProductDescription)}
        />
      </Box>
      <Box display={'flex'} columnGap={2}>
        <Controller
          name="DeliveredNumber"
          control={control}
          rules={{
            validate: {
              greaterThanZero: (value) => {
                if (value === null || value === undefined) return true;
                return value >= 0 || t('NEGATIVE_NUMBER_NOT_ALLOWED');
              },
              notExceedOrderedQuantity: (value) => {
                if (value === null || value === undefined) return true;
                return (
                  value + data.ReceivedQuantity < data.OrderedQuantity ||
                  t('EXCEEDS_ORDERED_QUANTITY')
                );
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              aria-label="Anz Arrived"
              fullWidth
              type="number"
              label={t('ANZ_ARRIVED')}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="DeliveryNumber"
          control={control}
          rules={{
            required: t('FIELD_IS_REQUIRED'),
            validate: (value) => {
              const numValue = Number(value);
              if (isNaN(numValue)) return t('FIELD_IS_REQUIRED');
              if (numValue < 0) return t('NEGATIVE_NUMBER_NOT_ALLOWED');
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              aria-label="LIEFERNR"
              {...field}
              fullWidth
              type="number"
              label={t('LIEFERNR')}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <TextField
          disabled
          fullWidth
          label={t('ANZ_ORDERED')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.OrderedQuantity)}
        />
      </Box>
      <Box width={'100%'} display={'flex'} columnGap={2}>
        <TextField
          disabled
          sx={{ width: '33%' }}
          label={t('LP')}
          InputLabelProps={{
            shrink: true,
          }}
          value={formatCurrency(data.ListPriceExclTax)}
        />
        <TextField
          disabled
          sx={{ width: '33%' }}
          label={t('PRODUCT_ID')}
          InputLabelProps={{
            shrink: true,
          }}
          value={sanitizeData(data.ProductId)}
        />
        <Box sx={{ width: '33%' }} display={'flex'} alignItems={'center'}>
          <FormControlLabel
            control={<Checkbox aria-label="SWGA" disabled checked={!!data.IsWga} />}
            labelPlacement="end"
            label={<Typography variant="body2">{t('S_WGA')}</Typography>}
          />
        </Box>
      </Box>
    </Box>
  );
});
EditNightDelivery.displayName = 'EditNightDelivery';
export default EditNightDelivery;
