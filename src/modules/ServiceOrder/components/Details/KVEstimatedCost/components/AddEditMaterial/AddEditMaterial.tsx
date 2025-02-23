import { type TableData } from '@/src/components/CustomTable/types';
import { getDate } from '@/src/helpers/formatDate';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import { getNumberOrNull, getStringOrNull } from '@/src/helpers/sanitizeData';
import { type SamKv, type SamKvDetail } from '@/src/hooks/useTourData/tourData.interface';
import { Grid, Input, TextField } from '@mui/material';
import dayjs from 'dayjs';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  kvData: SamKv;
  productData?: TableData;
  materialData?: TableData;
  type: 'add' | 'edit';
  onSubmitForm: (formData: SamKvDetail) => void;
}

const AddEditMaterial = forwardRef(
  ({ kvData, productData, materialData, type, onSubmitForm }: Props, ref) => {
    const { t } = useTranslation('index');

    const {
      register,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm<SamKvDetail>({
      defaultValues: {
        UId: type === 'add' ? getUniqueID() : (materialData?.UId as string),
        SamKvUId: kvData.UId,
        SamKvDetailId: type === 'add' ? getUniqueNumber() : (materialData?.SamKvDetailId as number),
        SamKvId: kvData.SamKvId,
        CreatedAt:
          type === 'add' ? dayjs().toISOString() : getStringOrNull(materialData?.CreatedAt),
        ChangedBy: kvData.ChangedBy,
        UpdatedAt: dayjs().toISOString(),
        Quantity: type === 'add' ? 0 : (materialData?.Quantity as number),
        ArticleNumber: getStringOrNull(
          productData?.ManufacturerArticleNumber ?? materialData?.ArticleNumber
        ),
        Description: getStringOrNull(productData?.Description ?? materialData?.Description),

        ProductId: getNumberOrNull(productData?.ProductId ?? materialData?.ProductId),
        TotalCost: (productData?.ListPriceExcl as number) ?? (materialData?.TotalCost as number),
        UnitPrice: (productData?.ListPriceExcl as number) ?? (materialData?.UnitPrice as number),
      },
    });

    const onSubmit: SubmitHandler<SamKvDetail> = (formData) => {
      onSubmitForm(formData);
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <Grid container spacing={3} aria-label="edit-material">
        <Grid item mobile={4}>
          <TextField
            fullWidth
            disabled
            label={t('PRODUCT_ID')}
            type="number"
            InputLabelProps={{ shrink: true }}
            {...register('ProductId')}
          />
        </Grid>
        <Grid item mobile={4}>
          <TextField
            required
            fullWidth
            label={t('QUANTITY')}
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            {...register('Quantity', { valueAsNumber: true, required: true })}
            {...(errors.Quantity && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
          />
        </Grid>
        <Grid item mobile={4}>
          <Input disabled type="hidden" {...register('CreatedAt')} />
          <TextField
            label={t('CREATED_ON')}
            value={getValues('CreatedAt') ? getDate(getValues('CreatedAt') ?? undefined) : '-'}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            disabled
            label={t('ARTICLE_NO')}
            InputLabelProps={{ shrink: true }}
            {...register('ArticleNumber')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            disabled
            label={t('DESIGNATION')}
            InputLabelProps={{ shrink: true }}
            {...register('Description')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            fullWidth
            disabled
            label={t('KV_OPERATION')}
            InputLabelProps={{ shrink: true }}
            {...register('UnitPrice')}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            fullWidth
            disabled
            label={t('KV_LIFESPAN')}
            InputLabelProps={{ shrink: true }}
            {...register('TotalCost')}
          />
        </Grid>

        <Grid item mobile={6}>
          <Input disabled type="hidden" {...register('UpdatedAt')} />
          <TextField
            label={t('CHANGED_ON')}
            value={getValues('UpdatedAt') ? getDate(getValues('UpdatedAt') ?? undefined) : '-'}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            label={t('CHANGED_BY')}
            {...register('ChangedBy')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    );
  }
);

AddEditMaterial.displayName = 'AddEditMaterial';

export default AddEditMaterial;
