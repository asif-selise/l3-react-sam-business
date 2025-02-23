import { type SamOffer } from '@/src/hooks/useTourData/tourData.interface';
import { Box, TextField } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type operationType } from '../../CreateOffer';

type SamOfferKeys = keyof Partial<SamOffer>;
interface Props {
  type: operationType;
  vatRate: number;
  newOfferData: Partial<SamOffer> | null;
  saveStepData: (data: Partial<SamOffer>) => void;
}

const AdditionalCosts = forwardRef(({ type, saveStepData, vatRate, newOfferData }: Props, ref) => {
  const { t } = useTranslation('index');

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<SamOffer>>({
    mode: 'onTouched',
    defaultValues: {
      Vrg: 0.0,
      VatRate: vatRate,
      Installation: 0.0,
      Takeover: 0.0,
      Accessory: 0.0,
    },
  });

  useEffect(() => {
    if (type === 'edit' && newOfferData) {
      reset({
        Vrg: newOfferData.Vrg ? parseFloat(newOfferData.Vrg.toFixed(4)) : 0.0,
        Installation: newOfferData.Installation
          ? parseFloat(newOfferData.Installation.toFixed(4))
          : 0.0,
        VatRate: newOfferData.VatRate,
        Takeover: newOfferData.Takeover ? parseFloat(newOfferData.Takeover.toFixed(4)) : 0.0,
        Accessory: newOfferData.Accessory ? parseFloat(newOfferData.Accessory.toFixed(4)) : 0.0,
      });
    }
  }, [type, newOfferData, reset]);

  const onSubmit = (data: Partial<SamOffer>) => {
    saveStepData(data);
  };

  useImperativeHandle(ref, () => ({
    handleSubmitForm: () => {
      handleSubmit(onSubmit)();
    },
  }));

  const handleDecimalPrecision =
    (fieldName: SamOfferKeys, precisionPoint?: number) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setValue(fieldName, parseFloat(value.toFixed(precisionPoint ?? 2)));
      }
    };

  return (
    <Box p={'24px'} display={'flex'} flexDirection={'column'} rowGap={3}>
      <Box display={'flex'} columnGap={3}>
        <TextField
          required
          fullWidth
          type="number"
          label={t('VRG')}
          {...register('Vrg', { required: true, valueAsNumber: true })}
          onBlur={handleDecimalPrecision('Vrg', 4)}
          {...(errors.Vrg && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />

        <TextField
          required
          fullWidth
          type="number"
          label={t('INSTALLATION')}
          {...register('Installation', { required: true, valueAsNumber: true })}
          onBlur={handleDecimalPrecision('Installation', 4)}
          {...(errors.Installation && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />
        <TextField
          required
          fullWidth
          disabled
          type="number"
          label={t('MWST')}
          {...register('VatRate', { required: true, valueAsNumber: true })}
          {...(errors.VatRate && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />
      </Box>
      <Box width={'66%'} display={'flex'} columnGap={3}>
        <TextField
          required
          fullWidth
          type="number"
          label={t('WITHDRAWAL')}
          {...register('Takeover', { required: true, valueAsNumber: true })}
          onBlur={handleDecimalPrecision('Takeover', 4)}
          {...(errors.Takeover && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />
        <TextField
          required
          fullWidth
          type="number"
          label={t('ACCESSORIES')}
          {...register('Accessory', { required: true, valueAsNumber: true })}
          onBlur={handleDecimalPrecision('Accessory', 4)}
          {...(errors.Accessory && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />
      </Box>
    </Box>
  );
});

AdditionalCosts.displayName = 'AdditionalCosts';

export default AdditionalCosts;
