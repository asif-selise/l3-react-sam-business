import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type CreateESOFields } from '../../types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type WorkflowItemRelation,
  type WorkflowItem,
} from '@/src/hooks/useMasterData/masterData.interface';

interface Props {
  orderId?: number | null;
  remarks?: string;
  newEsoId?: number;
  onSubmitForm: (formData: CreateESOFields) => void;
}

const CreateESO = forwardRef(({ orderId = null, onSubmitForm, newEsoId, remarks }: Props, ref) => {
  const { t } = useTranslation('index');

  const [newEsoData, setNewEsoData] = useState<WorkflowItem[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateESOFields>({
    mode: 'onTouched',
    defaultValues: {
      SO: orderId,
      Remarks: remarks ?? '',
    },
  });

  const { dataList: workflowItemRelations, getDataList: getWorkflowItemRelations } =
    useIndexedDbData<WorkflowItemRelation>('MasterData', 'WorkflowItemRelations');

  const { dataList: workflowItems, getDataList: getWorkflowItems } = useIndexedDbData<WorkflowItem>(
    'MasterData',
    'WorkflowItems'
  );

  useEffect(() => {
    getWorkflowItems();
    getWorkflowItemRelations();
  }, []);

  const filterEsoData = workflowItems?.filter((workflowItem) => workflowItem.SamEsoFollowers > 0);
  // const newEsoDataInitial = useMemo(() => {
  //   return workflowItems?.filter((workflowItem) => !workflowItem.IsNewCreatiedItemAllowed);
  // }, [workflowItems]);

  // useEffect(() => {
  //   setNewEsoData(newEsoDataInitial);
  // }, [newEsoDataInitial]);

  useEffect(() => {
    if (workflowItems) {
      setNewEsoData(workflowItems.filter((x: WorkflowItem) => x.IsActive));
    }
  }, [workflowItems]);

  const updateNewEsoData = (workflowId: number) => {
    const workflowItemRelationsFiltered = workflowItemRelations.filter(
      (workflowItemRelation) => workflowItemRelation.Predecessor === workflowId
    );

    const filteredNewEsoData = workflowItems.filter((workflowItem) =>
      workflowItemRelationsFiltered.some((relation) => relation.Successor === workflowItem.Id)
    );

    setNewEsoData(filteredNewEsoData);
  };

  const workflowIdToItemMap = useMemo(() => {
    return new Map(workflowItems.map((item) => [item.Id, item]));
  }, [workflowItems]);

  const newEsoIdToItemTypeMap = useMemo(() => {
    return new Map(newEsoData.map((item) => [item.Id, item.TypeItem]));
  }, [newEsoData]);

  const updateFields = () => {
    if (newEsoId) {
      setValue('NewESO', { Id: newEsoId, TypeItem: newEsoIdToItemTypeMap.get(newEsoId) ?? '' });
    }
  };

  useEffect(() => {
    updateFields();
  }, [newEsoId, newEsoIdToItemTypeMap]);

  const onSubmit: SubmitHandler<CreateESOFields> = (formData) => {
    onSubmitForm(formData);
  };

  useImperativeHandle(ref, () => ({
    handleSubmitForm: () => {
      handleSubmit(onSubmit)();
    },
  }));

  return (
    <Grid container spacing={3} aria-label="create-eso-form">
      <Grid item mobile={12}>
        <Controller
          name="FilterESO"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              fullWidth
              options={filterEsoData}
              value={workflowIdToItemMap.get(Number(field.value)) ?? null}
              getOptionLabel={(option) => option.TypeItem ?? ''}
              onChange={(event, newValue) => {
                field.onChange(newValue?.Id ?? null);
                if (newValue?.Id) {
                  updateNewEsoData(newValue.Id);
                  setValue('NewESO', null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('FILTER_ESO_PROCESS')}
                  InputLabelProps={{ shrink: true }}
                  {...(error && { error: true, helperText: error.message })}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item mobile={12}>
        <Controller
          control={control}
          name="NewESO"
          rules={{ required: t('FIELD_IS_REQUIRED') }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              fullWidth
              options={newEsoData}
              value={field.value?.Id ? workflowIdToItemMap.get(field.value.Id) ?? null : null}
              getOptionLabel={(option) => option.TypeItem ?? ''}
              isOptionEqualToValue={(option, value) => option.Id === value.Id}
              onChange={(event, newValue) => {
                field.onChange(newValue ? { Id: newValue.Id, TypeItem: newValue.TypeItem } : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label={t('NEW_ESO')}
                  InputLabelProps={{ shrink: true }}
                  {...(error && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item mobile={12}>
        <TextField
          fullWidth
          required
          label={t('SO')}
          InputLabelProps={{ shrink: true }}
          {...register('SO', { required: true, valueAsNumber: true })}
          {...(errors.SO && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        ></TextField>
      </Grid>

      <Grid item mobile={12}>
        <TextField
          required
          fullWidth
          multiline
          rows={5}
          label={t('REMARKS')}
          InputLabelProps={{ shrink: true }}
          {...register('Remarks', { required: true })}
          {...(errors.Remarks && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
        />
      </Grid>
    </Grid>
  );
});

CreateESO.displayName = 'CreateESO';

export default CreateESO;
