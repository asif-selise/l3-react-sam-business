import {
  useForm,
  Controller,
  type SubmitHandler,
  type ControllerRenderProps,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, Grid, TextField, MenuItem } from '@mui/material';
import { type TableData } from '@/src/components/CustomTable/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  type SamTarget,
  type WarehouseLocation,
} from '@/src/hooks/useMasterData/masterData.interface';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import {
  type ProductQuantityOnOrder,
  type UsersSamOrder,
} from '@/src/hooks/useTourData/tourData.interface';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { formatCurrency } from '@/src/helpers/formatCurrency';

export interface AddEditArticleUsageOrderingProps {
  onSubmitForm: (formData: UsersSamOrder) => void;
  type: 'add' | 'edit';
  data?: TableData;
  showAllSourceStocks: boolean;
}

const AddEditArticleUsageOrdering = forwardRef(
  ({ onSubmitForm, data, type, showAllSourceStocks }: AddEditArticleUsageOrderingProps, ref) => {
    const { t } = useTranslation('index');
    const dispatch = useDispatch();
    const id = useSelector((state: any) => state.serviceOrder.id);
    const { data: technicianData } = useTechnicianData();

    const {
      customFilteredDataList: warehouseLocations,
      getCustomFilteredDataList: getWarehouseLocations,
    } = useIndexedDbData<WarehouseLocation>('MasterData', 'WarehouseLocations');

    const { dataList: productQuantityOnOrdersData, getDataList: getProductQuantityOnOrdersData } =
      useIndexedDbData<ProductQuantityOnOrder>('TourPlanData', 'ProductQuantityOnOrders');

    const { dataList: samTargets, getDataList: getSamTargets } = useIndexedDbData<SamTarget>(
      'MasterData',
      'SamTargets'
    );

    useEffect(() => {
      getSamTargets().then();
      getProductQuantityOnOrdersData().then();
    }, []);

    useEffect(() => {
      let samOrders: UsersSamOrder[] = [];

      if (data && Array.isArray(data)) {
        samOrders = (data as unknown as UsersSamOrder[]).filter(
          (it) => (it.WarehouseLocation ?? 0) > 0
        );
      }

      const warehouseLocationFilter = (it: WarehouseLocation) => {
        return (
          (it.WarehouseLocationId === 0 ||
            (it.IsWaterAndGasConnected === showAllSourceStocks && it.IsActive) ||
            (it.TechnicianEmployeeNumber === technicianData?.technicianEmployeeNumber &&
              it.IsActive)) &&
          !(it.QCPTStorageLocationDetailedIncludingBusinessLocation ?? '').includes(
            'Standardlager'
          ) &&
          it.IsSamSourceOfSupply &&
          (samOrders?.length > 0
            ? samOrders.some((x) => x.WarehouseLocation === it.WarehouseLocationId)
            : true)
        );
      };

      getWarehouseLocations(warehouseLocationFilter).then();
    }, [technicianData]);

    const {
      register,
      control,
      handleSubmit,
      getValues,
      trigger,
      watch,
      formState: { errors },
    } = useForm<UsersSamOrder>({
      mode: 'onTouched',
      defaultValues:
        type === 'edit'
          ? {
              UId: data?.UId as string,
              ManufacturerArticleNumber: data?.ManufacturerArticleNumber as string,
              OrderId: data?.OrderId as number,
              ProductCount: data?.ProductCount as number,
              Description: data?.Description as string,
              ListPriceIncludingTax: data?.ListPriceIncludingTax as number,
              ListPriceExcludingTax: data?.ListPriceExcludingTax as number,
              RecyclingFee: data?.RecyclingFee as number,
              WarehouseLocation: data?.WarehouseLocation as number,
              IsUsed: data?.IsUsed as boolean,
              DestinationWarehouse: data?.DestinationWarehouse as number,
              ProductId: data?.ProductId as number,
              BarcodeRequiredProductType: data?.BarcodeRequiredProductType as number,
              IsSet: data?.IsSet as string,
              OnlyUsedMutatingIsAllowed: data?.OnlyUsedMutatingIsAllowed as boolean,
              IstSWga: data?.IstSWga as number,
            }
          : {
              UId: uuidv4(),
              ManufacturerArticleNumber: data?.ManufacturerArticleNumber as string,
              OrderId: Number(id),
              ProductCount: 1,
              Description: data?.Description as string,
              ListPriceIncludingTax: data?.ListPriceIncl as number,
              ListPriceExcludingTax: data?.ListPriceExcl as number,
              RecyclingFee: data?.RecyclingFee as number,
              WarehouseLocation: 0,
              IsUsed: false,
              DestinationWarehouse: null,
              ProductId: data?.ProductId as number,
              BarcodeRequiredProductType: 0,
              IsSet: null,
              OnlyUsedMutatingIsAllowed: false,
              IstSWga: 0,
            },
    });

    const watchWarehouseLocation = watch('WarehouseLocation');
    const filteredWarehouseLocations = warehouseLocations?.filter((item) => item.IsActive);
    const filteredSamTargets = samTargets?.filter((item) => item.IsActive);

    const onSubmit: SubmitHandler<UsersSamOrder> = (formData) => {
      const validations = [
        errorWhenTargetIsNotEqualTo1AndNotEqualTo0,
        errorWhenOrdersWithUsedEnabled,
        errorWhenOrdersAreCorrectButHaveAnIncorrectTarget,
        errorAnUnauthorizedTargetWasUsedForANonUsedItem,
        errorWhenProductCountIsGreaterThan10,
        validateItemsIncorrectStorageSourceOrDestination,
        validateItemsUsedIncorrectDestination,
        validateItemsUnusedNoDestination,
        validateOrderErrorUsedOrDestination,
      ];

      if (validations.every((validate) => validate())) {
        onSubmitForm(formData);
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    const renderCheckbox = <T extends keyof UsersSamOrder>(
      field: ControllerRenderProps<UsersSamOrder, T>,
      disabled: boolean = false
    ) => {
      return <Checkbox disabled={disabled} checked={!!field.value} {...field} />;
    };

    const errorWhenTargetIsNotEqualTo1AndNotEqualTo0 = () => {
      const isUsed = getValues('IsUsed');
      const destinationWarehouse = getValues('DestinationWarehouse');

      const isInvalid =
        isUsed && (destinationWarehouse ?? 1) !== 1 && (destinationWarehouse ?? 0) !== 0;

      if (isInvalid) {
        dispatch(showErrorMessage(t('ERROR_WHEN_TARGET_IS_NOT_EQUAL_TO_1_AND_NOT_EQUAL_TO_0')));
        return false;
      }

      return true;
    };

    const errorWhenOrdersWithUsedEnabled = () => {
      const sourceWarehouse = getValues('WarehouseLocation');
      const isUsed = getValues('IsUsed');

      const isInvalid = (sourceWarehouse ?? 0) === 0 && isUsed;

      if (isInvalid) {
        dispatch(showErrorMessage(t('ERROR_WHEN_ORDERS_WITH_USED_ENABLED')));
        return false;
      }

      return true;
    };

    const errorWhenOrdersAreCorrectButHaveAnIncorrectTarget = () => {
      const sourceWarehouse = getValues('WarehouseLocation');
      const destinationWarehouse = getValues('DestinationWarehouse');

      const isInvalid =
        (sourceWarehouse ?? 0) === 0 &&
        (destinationWarehouse ?? 0) >= 1 &&
        (destinationWarehouse ?? 0) <= 6;

      if (isInvalid) {
        dispatch(showErrorMessage(t('ERROR_WHEN_ORDERS_ARE_CORRECT_BUT_HAVE_AN_INCORRECT_TARGET')));
        return false;
      }

      return true;
    };

    const errorAnUnauthorizedTargetWasUsedForANonUsedItem = () => {
      const isUsed = getValues('IsUsed');
      const sourceWarehouse = getValues('WarehouseLocation');
      const destinationWarehouse = getValues('DestinationWarehouse');

      const isInvalid = !isUsed && (sourceWarehouse ?? 0) !== 0 && (destinationWarehouse ?? 0) < 2;

      if (isInvalid) {
        dispatch(showErrorMessage(t('ERROR_AN_UNAUTHORIZED_TARGET_WAS_USED_FOR_A_NON_USED_ITEM')));
        return false;
      }

      return true;
    };

    const errorWhenProductCountIsGreaterThan10 = () => {
      const productCount = getValues('ProductCount');

      const isInvalid = (productCount ?? 0) > 10;

      if (isInvalid) {
        dispatch(showErrorMessage(t('ERROR_WHEN_PRODUCT_COUNT_IS_GREATER_THAN_10')));
        return false;
      }

      return true;
    };

    const validateItemsIncorrectStorageSourceOrDestination = () => {
      const onlyUsedMutatingIsAllowed = getValues('OnlyUsedMutatingIsAllowed');
      const destinationWarehouse = getValues('DestinationWarehouse');
      const warehouseLocation = getValues('WarehouseLocation');

      const isInvalid =
        onlyUsedMutatingIsAllowed && (destinationWarehouse ?? 0) !== 0 && warehouseLocation === 0;

      if (isInvalid) {
        dispatch(
          showErrorMessage(
            t('ITEMS_INCORRECT_STORAGE_SOURCE_OR_DESTINATION', {
              productCount: getValues('ProductCount'),
            })
          )
        );
        return false;
      }
      return true;
    };

    const validateItemsUsedIncorrectDestination = () => {
      const isUsed = getValues('IsUsed');
      const samTarget = getValues('DestinationWarehouse');
      const onlyUsedMutatingIsAllowed = getValues('OnlyUsedMutatingIsAllowed');

      const isInvalid = isUsed && (samTarget ?? 1) !== 1 && !onlyUsedMutatingIsAllowed;

      if (isInvalid) {
        dispatch(
          showErrorMessage(
            t('ITEMS_USED_INCORRECT_DESTINATION', { productCount: getValues('ProductCount') })
          )
        );
        return false;
      }
      return true;
    };

    const validateItemsUnusedNoDestination = () => {
      const isUsed = getValues('IsUsed');
      const samTarget = getValues('DestinationWarehouse');
      const warehouseLocation = getValues('WarehouseLocation');
      const onlyUsedMutatingIsAllowed = getValues('OnlyUsedMutatingIsAllowed');

      const isInvalid =
        !isUsed && samTarget === null && warehouseLocation !== 0 && !onlyUsedMutatingIsAllowed;

      if (isInvalid) {
        dispatch(
          showErrorMessage(
            t('ITEMS_UNUSED_NO_DESTINATION', { productCount: getValues('ProductCount') })
          )
        );
        return false;
      }
      return true;
    };

    const validateOrderErrorUsedOrDestination = () => {
      const warehouseLocation = getValues('WarehouseLocation');
      const isUsed = getValues('IsUsed');
      const samTarget = getValues('DestinationWarehouse');
      const onlyUsedMutatingIsAllowed = getValues('OnlyUsedMutatingIsAllowed');

      const isInvalid =
        warehouseLocation === 0 && (isUsed || (samTarget ?? 0) > 0) && !onlyUsedMutatingIsAllowed;

      if (isInvalid) {
        dispatch(
          showErrorMessage(
            t('ORDER_ERROR_USED_OR_DESTINATION', { productCount: getValues('ProductCount') })
          )
        );
        return false;
      }
      return true;
    };

    useEffect(() => {
      trigger('ProductCount');
    }, [watchWarehouseLocation]);

    const validateProductCount = (value: number | null) => {
      if (value === null) return t('FIELD_IS_REQUIRED');
      if (value < 1 || value > 10) {
        return t('THE_VALUE_MUST_BE_GREATER_THAN');
      }
      const productId = getValues('ProductId');
      const warehouseLocation = getValues('WarehouseLocation');

      if (warehouseLocation === 0 || warehouseLocation === null) {
        return true;
      }

      const totalProductCount =
        productQuantityOnOrdersData.find(
          (x: ProductQuantityOnOrder) =>
            x.OrderId === id &&
            x.ProductId === productId &&
            x.WarehouseLocation === warehouseLocation
        )?.TotalProduct ?? 0;

      if (totalProductCount == null || (value && value > totalProductCount)) {
        return t('STOCK_NOT_AVAILABLE');
      }

      return true;
    };

    return (
      <Grid container spacing={3} aria-label="Edit Article Usage Ordering Modal">
        <Grid item mobile={12}>
          <TextField
            required
            fullWidth
            label={t('ANZ')}
            type="number"
            InputLabelProps={{ shrink: true }}
            {...register('ProductCount', {
              required: true,
              validate: validateProductCount,
            })}
            {...(errors.ProductCount && {
              error: true,
              helperText: errors.ProductCount?.message
                ? errors.ProductCount.message
                : t('FIELD_IS_REQUIRED'),
            })}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            disabled
            required
            fullWidth
            label={t('ARTICLE_NO')}
            InputLabelProps={{ shrink: true }}
            {...register('ManufacturerArticleNumber', { required: true })}
            {...(errors.ManufacturerArticleNumber && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            required
            disabled
            fullWidth
            label={t('ARTICLE_DESCRIPTION')}
            InputLabelProps={{ shrink: true }}
            {...register('Description', { required: true })}
            {...(errors.Description && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
          />
        </Grid>

        <Grid item mobile={4}>
          <TextField
            disabled
            fullWidth
            label={t('GROSS_INCL')}
            value={formatCurrency(getValues('ListPriceIncludingTax'))}
            InputLabelProps={{ shrink: true }}
            {...register('ListPriceIncludingTax')}
          />
        </Grid>
        <Grid item mobile={4}>
          <TextField
            disabled
            fullWidth
            label={t('GROSS_EXCL')}
            value={formatCurrency(getValues('ListPriceExcludingTax'))}
            InputLabelProps={{ shrink: true }}
            {...register('ListPriceExcludingTax')}
          />
        </Grid>
        <Grid item mobile={4}>
          <TextField
            disabled
            fullWidth
            label={t('FEA_S_EXCL')}
            value={formatCurrency(getValues('RecyclingFee'))}
            InputLabelProps={{ shrink: true }}
            {...register('RecyclingFee')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            required
            select
            fullWidth
            label={t('SOURCE_STOCK')}
            defaultValue={getValues('WarehouseLocation')}
            InputLabelProps={{ shrink: true }}
            {...register('WarehouseLocation', { required: true })}
            {...(errors.WarehouseLocation && {
              error: true,
              helperText: t('FIELD_IS_REQUIRED'),
            })}
          >
            {filteredWarehouseLocations?.map((option) => (
              <MenuItem key={option.WarehouseLocationId} value={option.WarehouseLocationId}>
                {option.QCPTStorageLocationDetailedIncludingBusinessLocation}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item mobile={6}>
          <TextField
            select
            fullWidth
            label={t('OBJECTIVE')}
            defaultValue={getValues('DestinationWarehouse')}
            InputLabelProps={{ shrink: true }}
            {...register('DestinationWarehouse')}
          >
            {filteredSamTargets?.map((option) => (
              <MenuItem key={option.SamTargetId} value={option.SamTargetId}>
                {option.Task}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            label={t('PRODUCT_ID')}
            InputLabelProps={{ shrink: true }}
            {...register('ProductId')}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            disabled
            fullWidth
            label={t('SET')}
            InputLabelProps={{ shrink: true }}
            {...register('IsSet')}
          />
        </Grid>

        <Grid item mobile={2}>
          <Controller
            name="IstSWga"
            control={control}
            render={({ field }) => (
              <FormControlLabel control={renderCheckbox(field, true)} label={t('S_WGA')} />
            )}
          />
        </Grid>

        <Grid item mobile={2}>
          <Controller
            name="IsUsed"
            control={control}
            render={({ field }) => (
              <FormControlLabel control={renderCheckbox(field)} label={t('IS_USED')} />
            )}
          />
        </Grid>

        <Grid item mobile={2}>
          <Controller
            name="BarcodeRequiredProductType"
            control={control}
            render={({ field }) => (
              <FormControlLabel control={renderCheckbox(field, true)} label={t('BC')} />
            )}
          />
        </Grid>
      </Grid>
    );
  }
);

AddEditArticleUsageOrdering.displayName = 'AddEditArticleUsageOrdering';

export default AddEditArticleUsageOrdering;
