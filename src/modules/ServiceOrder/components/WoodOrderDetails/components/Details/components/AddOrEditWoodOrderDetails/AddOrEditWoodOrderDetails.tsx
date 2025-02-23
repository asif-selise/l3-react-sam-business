import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Box } from '@mui/material';
import { type WoodOrderDetail, type WoodOrder } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueNumber } from '@/src/helpers/generateID';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { numberValidation } from '@/src/helpers/numberValidation';

interface Props {
  type: 'add' | 'edit';
  add?: {
    data: WoodOrder;
    setSelectedWoodOrderID: React.Dispatch<React.SetStateAction<number | null>>;
  };
  edit?: {
    data: WoodOrderDetail;
    setEditData: Dispatch<SetStateAction<WoodOrderDetail | undefined>>;
    getFilteredWoodOrderList: <K extends keyof WoodOrderDetail>(
      filteredKey: K,
      filteredValue: WoodOrderDetail[K]
    ) => Promise<void>;
  };
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const AddOrEditWoodOrderDetails = ({ setOpenModal, type, add, edit }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const {
    dataList: woodOrderDetailsList,
    getDataList: getWoodOrderDetailsList,
    updateDataList: updateWoodOrderDetailsList,
  } = useIndexedDbData<WoodOrderDetail>('TourPlanData', 'WoodOrderDetails');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WoodOrderDetail>({
    mode: 'onTouched',
    defaultValues:
      type === 'add'
        ? {
            UId: uuidv4(),
            WoodOrderId: add?.data.WoodOrderId,
            WoodOrderUId: add?.data.UId,
            WoodOrderDetailId: getUniqueNumber(),
            isNew: true,
          }
        : {
            UId: edit?.data.UId,
            WoodOrderId: edit?.data.WoodOrderId,
            WoodOrderUId: edit?.data.WoodOrderUId,
            WoodOrderDetailId: edit?.data.WoodOrderDetailId,
            Quantity: edit?.data.Quantity,
            DMassD: edit?.data.DMassD,
            DMassH: edit?.data.DMassH,
            DMassL: edit?.data.DMassL,
            Description: edit?.data.Description,
            EdgeDetailEdgeColor: edit?.data.EdgeDetailEdgeColor,
            EdgeDetailSurfaceColor: edit?.data.EdgeDetailSurfaceColor,
            Remark: edit?.data.Remark,
            isNew: edit?.data?.isNew ?? false,
          },
  });

  const updateData = async (dataList: WoodOrderDetail[], updateData: WoodOrderDetail) => {
    await updateWoodOrderDetailsList(
      dataList,
      updateData,
      type === 'add' ? 'InsertRecords' : 'UpdateRecords',
      'WoodOrderDetailsUpdateRequestModel'
    );
  };

  const onSubmit = async (formData: WoodOrderDetail) => {
    if (!woodOrderDetailsList && !add) {
      return dispatch(showErrorMessage(t('SOMETHING_WENT_WRONG')));
    }

    if (woodOrderDetailsList) {
      if (type === 'add' && add) {
        const updatedWoodOrderDetailsList = [...woodOrderDetailsList, formData];
        await updateData(updatedWoodOrderDetailsList, formData);
        dispatch(showSuccessMessage(t('NEW_ITEM_ADDED_SUCCESSFULLY')));
        add.setSelectedWoodOrderID(add.data.WoodOrderId);
      }
      if (type === 'edit' && edit && isDirty) {
        const updatedWoodOrderDetailsList = woodOrderDetailsList.map((item) =>
          item.UId === formData.UId ? formData : item
        );
        await updateData(updatedWoodOrderDetailsList, formData);
        edit.getFilteredWoodOrderList('WoodOrderId', edit.data.WoodOrderId);
        dispatch(showSuccessMessage(t('ITEM_UPDATED_SUCCESSFULLY')));
        edit.setEditData(undefined);
      }
      setOpenModal(false);
    }
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    getWoodOrderDetailsList();
  }, []);

  useEffect(() => {
    if (add) {
      add.setSelectedWoodOrderID(null);
    }
  }, [add]);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            setOpenModal(false);
            edit?.setEditData(undefined);
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
      title={type === 'add' ? t('ADD_NEW_WOOD_ORDER_DETAILS') : t('EDIT_WOOD_ORDER_DETAILS')}
      actions={modalActions}
      onClose={() => {
        setOpenModal(false);
        edit?.setEditData(undefined);
      }}
    >
      <Grid container rowGap={3} aria-label="Edit Wood Order Details Modal">
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <TextField fullWidth disabled label={t('WOOD_ORDER_ID')} {...register('WoodOrderId')} />

          <Controller
            name="DMassD"
            control={control}
            rules={numberValidation(1, t('ENTER_A_VALID_NUMBER'), t('FIELD_IS_REQUIRED'))}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={t('MASS_D')}
                fullWidth
                error={!!errors.DMassD}
                helperText={errors.DMassD?.message}
                type="number"
              />
            )}
          />

          <TextField
            required
            fullWidth
            label={t('COVERED_EDGES_OR_EDGE_COLOR')}
            error={!!errors.EdgeDetailEdgeColor}
            helperText={errors.EdgeDetailEdgeColor?.message}
            {...register('EdgeDetailEdgeColor', { required: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <Controller
            name="Quantity"
            control={control}
            rules={numberValidation(1, t('ENTER_A_VALID_NUMBER'), t('FIELD_IS_REQUIRED'))}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={t('QUANTITY')}
                fullWidth
                error={!!errors.Quantity}
                helperText={errors.Quantity?.message}
                type="number"
              />
            )}
          />

          <Controller
            name="DMassH"
            control={control}
            rules={numberValidation(1, t('ENTER_A_VALID_NUMBER'), t('FIELD_IS_REQUIRED'))}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={t('MASS_H')}
                fullWidth
                error={!!errors.DMassH}
                helperText={errors.DMassH?.message}
                type="number"
              />
            )}
          />
          <TextField
            required
            fullWidth
            label={t('SURFACE_COLOR')}
            error={!!errors.EdgeDetailSurfaceColor}
            helperText={errors.EdgeDetailSurfaceColor?.message}
            {...register('EdgeDetailSurfaceColor', { required: t('FIELD_IS_REQUIRED') })}
          />
        </Box>
        <Box width={'100%'} display={'flex'} columnGap={2}>
          <TextField fullWidth multiline label={t('REMARKS')} {...register('Remark')} />

          <Controller
            name="DMassL"
            control={control}
            rules={numberValidation(1, t('ENTER_A_VALID_NUMBER'), t('FIELD_IS_REQUIRED'))}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={t('MASS_L')}
                fullWidth
                error={!!errors.DMassL}
                helperText={errors.DMassL?.message}
                type="number"
              />
            )}
          />
          <TextField
            {...register('Description', { required: t('FIELD_IS_REQUIRED') })}
            required
            fullWidth
            multiline
            label={t('DESCRIPTION')}
            error={!!errors.Description}
            helperText={errors.Description?.message}
          />
        </Box>
      </Grid>
    </CustomModal>
  );
};

export default AddOrEditWoodOrderDetails;
