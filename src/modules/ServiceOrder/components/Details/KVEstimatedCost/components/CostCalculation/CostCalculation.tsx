import {
  type PersonalEffort,
  type SamKv,
  type SamKvDetail,
  type SamKvTimeFrame,
  type ServiceOrderDetail,
  type WorkflowDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { Button, Grid, Input, TextField, Typography } from '@mui/material';
import {
  type Dispatch,
  forwardRef,
  type SetStateAction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getMaxStartDay, roundNumber } from '../../utils/helpers';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type CurrentUserRightToFrontendAll,
  type QrptCurrentDefaultSettings,
  type SamKvAutoCalculation,
  type SamKvAutoCalculationFactor,
  type SamKvAutoCalculationPG,
  type SamKvAutoCalculationPGFactor,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type Factor, type KvCostFields } from '../../utils/types';
import { getDate, minuteToMilliseconds } from '@/src/helpers/formatDate';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from '@/src/redux/store';
import { showErrorMessage, showWarningMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { getMillis, getUtcCurrentDateTime } from '@/src/helpers/formatDateByLuxon';

interface Props {
  readOnly: boolean;
  setReadOnly: (value: boolean) => void;
  setReadOnlyMsg: Dispatch<SetStateAction<string | undefined>>;
  dataKv: SamKv | null | undefined;
  dataMaterials: SamKvDetail[];
  dataWorkflowDetail: WorkflowDetail | null;
  dataCurrentUserRightToFrontendAlls: CurrentUserRightToFrontendAll[];
  onSubmitForm: (formData: KvCostFields) => Promise<void>;
}

const CostCalculation = forwardRef(
  (
    {
      readOnly,
      setReadOnly,
      setReadOnlyMsg,
      dataKv,
      dataMaterials,
      dataWorkflowDetail,
      dataCurrentUserRightToFrontendAlls,
      onSubmitForm,
    }: Props,
    ref
  ) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const id = useSelector((state) => state.serviceOrder.id);

    const { register, setValue, watch, handleSubmit, getValues } = useForm<KvCostFields>({
      mode: 'onTouched',
      defaultValues: dataKv
        ? {
            ...dataKv,
            OperatingCosts: dataKv?.OperatingCosts ? Number(dataKv.OperatingCosts.toFixed(4)) : 0,
            LifeTimeTravelCosts: dataKv?.LifeTimeTravelCosts
              ? parseFloat(dataKv.LifeTimeTravelCosts.toFixed(4))
              : 0,
          }
        : {},
    });

    const onSubmit: SubmitHandler<KvCostFields> = (formData) => {
      onSubmitForm(formData);
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    const { dataList: calculationData, getDataList: getCalculation } =
      useIndexedDbData<SamKvAutoCalculation>('MasterData', 'SamKvAutoCalculations');

    const { dataList: calculationPGsData, getDataList: getCalculationPGs } =
      useIndexedDbData<SamKvAutoCalculationPG>('MasterData', 'SamKvAutoCalculationPGs');

    const { dataList: calculationPGFactorsData, getDataList: getCalculationPGFactors } =
      useIndexedDbData<SamKvAutoCalculationPGFactor>('MasterData', 'SamKvAutoCalculationPGFactors');

    const { dataList: calculationFactorsData, getDataList: getCalculationFactors } =
      useIndexedDbData<SamKvAutoCalculationFactor>('MasterData', 'SamKvAutoCalculationFactors');

    const { dataItem: serviceOrderData, getDataItem: getServiceOrder } =
      useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

    const { filteredDataList: timeFrameData, getFilteredDataList: getTimeFrame } =
      useIndexedDbData<SamKvTimeFrame>('TourPlanData', 'SamKvTimeFrames');

    const { filteredDataList: personalEffortsData, getFilteredDataList: getPersonalEfforts } =
      useIndexedDbData<PersonalEffort>('TourPlanData', 'PersonalEfforts');

    const { dataList: qrptCurrentDefaultSettingsData, getDataList: getQrptCurrentDefaultSettings } =
      useIndexedDbData<QrptCurrentDefaultSettings>('MasterData', 'QrptCurrentDefaultSettings');

    const [operatingMinutesReadonlyStatus, setOperatingMinutesReadonlyStatus] = useState(true);
    const [lifespanOperatingMinutesReadonlyStatus, setLifespanOperatingMinutesReadonlyStatus] =
      useState(true);
    const [operatingCostsReadonlyStatus, setOperatingCostsReadonlyStatus] = useState(false);
    const [lifeTimeTravelCostsReadonlyStatus, setLifeTimeTravelCostsReadonlyStatus] =
      useState(false);
    const [remarksReadonlyStatus, setRemarksReadonlyStatus] = useState(false);
    const [informedCustomerNameReadonlyStatus, setInformedCustomerNameReadonlyStatus] =
      useState(false);
    const [customerInformedAtReadOnlyStatus, setCustomerInformedAtReadOnlyStatus] = useState(false);
    const [nowButtonDisabledStatus, setNowButtonDisabledStatus] = useState(false);

    const watchFields = watch();

    useEffect(() => {
      getCalculation();
      getCalculationPGs();
      getCalculationPGFactors();
      getCalculationFactors();
      getQrptCurrentDefaultSettings();
    }, []);

    useEffect(() => {
      if (id) {
        getServiceOrder('OrderId', Number(id));
        getPersonalEfforts('OrderId', Number(id));
      }
    }, [id]);

    useEffect(() => {
      if (dataKv?.SamKvId) {
        getTimeFrame('SamKvId', dataKv.SamKvId);
      }
    }, [dataKv]);

    useEffect(() => {
      if (readOnly) {
        setOperatingCostsReadonlyStatus(true);
        setLifeTimeTravelCostsReadonlyStatus(true);
        setRemarksReadonlyStatus(true);
        setInformedCustomerNameReadonlyStatus(true);
        setCustomerInformedAtReadOnlyStatus(true);
        setNowButtonDisabledStatus(true);
      } else {
        const status = getReadOnlyStatusForOperatingMinutesAndLifespanOperatingMinutes();

        if (!status) {
          setOperatingMinutesReadonlyStatus(false);
          setLifespanOperatingMinutesReadonlyStatus(false);
        }
      }
    }, [readOnly]);

    useEffect(() => {
      if (readOnly && !dataKv?.OrderTakenBy?.trim()) {
        setReadOnlyMsg(t('KV_IS_READ_ONLY_NOT_EDITABLE'));
      } else if (dataKv?.OrderTakenBy?.trim()) {
        setReadOnlyMsg(t('KV_NO_LONGER_PROCESSED'));
        setReadOnly(true);
      }
    }, [readOnly, dataKv]);

    // Recht_Frontend_Check_MinEinesDerRechte
    const getReadOnlyStatusForOperatingMinutesAndLifespanOperatingMinutes = () => {
      // initialy set OperatingMinutes & LifespanOperatingMinutes text box true

      const status = dataCurrentUserRightToFrontendAlls.some(
        (it) => it.RightToFrontendUser === '216'
      );

      return !status;
    };

    const calculateTotalCosts = () => {
      if (readOnly) {
        dispatch(showWarningMessage(t('KV_READ_ONLY_WORK_TIME_RECALCULATED')));
      } else {
        enterSecondVisitTime();
        enterFirstVisitTime();
      }

      if (!serviceOrderData || !dataKv || !dataMaterials) return;

      const multiple = 0.05;
      const roundLikeSQLFunction = false;
      let totalOperation = 0;
      let totalLifeTime = 0;

      dataMaterials.forEach((material) => {
        totalOperation += (material.Quantity || 0) * (material.UnitPrice || 0);
        totalLifeTime += (material.Quantity || 0) * (material.TotalCost || 0);
      });

      totalOperation = roundNumber(totalOperation, multiple, roundLikeSQLFunction);
      totalLifeTime = roundNumber(totalLifeTime, multiple, roundLikeSQLFunction);

      totalOperation +=
        totalOperation * (watchFields.SmallClientPercentage ?? 0) +
        totalOperation * (watchFields.ProcessingPercentage ?? 0);

      totalLifeTime +=
        totalLifeTime * (watchFields.SmallClientPercentage ?? 0) +
        totalLifeTime * (watchFields.ProcessingPercentage ?? 0);

      setValue('TotalMaterialsOperation', totalOperation);

      setValue('TotalMaterialsLifeTime', totalLifeTime);

      const time2Operate = calculateTime(
        serviceOrderData.ProductGroup,
        totalOperation,
        watchFields.OperatingCosts || 0,
        watchFields.OperatingCostsPerMinute || 0,
        watchFields.OperatingMinutes
      );

      setValue('OperatingMinutesInVisit', time2Operate);

      totalOperation += watchFields.OperatingCosts;
      totalOperation +=
        (watchFields.OperatingMinutes + time2Operate) * watchFields.OperatingCostsPerMinute;

      const time2LifeTime = calculateTime(
        serviceOrderData.ProductGroup,
        totalLifeTime,
        watchFields.LifeTimeTravelCosts || 0,
        watchFields.OperatingCostsPerMinute || 0,
        watchFields.LifespanOperatingMinutes
      );

      setValue('LifeTimeVisitedWorkingTimeMin2', time2LifeTime);

      totalLifeTime += watchFields.LifeTimeTravelCosts;
      totalLifeTime +=
        (watchFields.LifespanOperatingMinutes + time2LifeTime) *
        watchFields.OperatingCostsPerMinute;

      totalOperation += roundNumber(
        (watchFields.VatRate || 0) * totalOperation,
        multiple,
        roundLikeSQLFunction
      );
      totalLifeTime += roundNumber(
        (watchFields.VatRate || 0) * totalLifeTime,
        multiple,
        roundLikeSQLFunction
      );

      setValue(
        'IncludeMaterialOperation',
        roundNumber(totalOperation, multiple, roundLikeSQLFunction)
      );
      setValue(
        'IncludeMaterialLifeTime',
        roundNumber(totalLifeTime, multiple, roundLikeSQLFunction)
      );
    };

    const enterFirstVisitTime = () => {
      const result = getFirstVisitTimeInMinuteIncludingBefore();

      if (result <= 0) {
        dispatch(showErrorMessage(t('WORK_TIME_CANNOT_BE_ENTERED_1ST_VISIT')));
        dispatch(showErrorMessage(t('ENTER_TIME_LESS_THAN_SO_TODAY')));
      }

      // If the working hours from the first visit can be changed, ask whether they should be overwritten
      const status = getReadOnlyStatusForOperatingMinutesAndLifespanOperatingMinutes();

      if (
        !status &&
        (watchFields.OperatingCosts.toString() !== result.toString() ||
          watchFields.LifespanOperatingMinutes.toString() !== result.toString())
      ) {
        dispatch(showErrorMessage(t('SHOULD_WORK_HOUR_BE_RECALCULATED_1ST_VISIT')));
        dispatch(showErrorMessage(t('RECALCULATE_1ST_VISIT')));
      }

      // Overwrite working hours from 1st visit if changed
      setValue('OperatingMinutes', result);
      setValue('LifespanOperatingMinutes', result);
    };

    const getFirstVisitTimeInMinuteIncludingBefore = () => {
      const maxStartDay = getMaxStartDay(personalEffortsData).toISO();
      const now = getUtcCurrentDateTime().toISO();

      const difference = getMillis(now) - getMillis(maxStartDay); // This will give difference in milliseconds
      let resultInMinutes = Math.round(difference / minuteToMilliseconds);

      if (resultInMinutes <= 0 || resultInMinutes >= 1440) {
        return 0;
      }

      resultInMinutes += qrptCurrentDefaultSettingsData[0].AdditionalMinutesForGroupS;
      resultInMinutes = Math.min(
        resultInMinutes,
        qrptCurrentDefaultSettingsData[0].MaximumMinuteInKVForFirstVisit
      );

      return resultInMinutes;
    };

    const enterSecondVisitTime = () => {
      let filteredTimeFrames = timeFrameData?.filter(
        (timeFrame) => !!timeFrame.MinuteRate && !!timeFrame.LifespanDuration
      );

      const sumMinuteRate = filteredTimeFrames?.reduce((acc, timeFrame) => {
        return acc + timeFrame.MinuteRate;
      }, 0);

      setValue('OperatingMinutesInVisit', sumMinuteRate);

      filteredTimeFrames = filteredTimeFrames?.filter((timeFrame) => !!timeFrame.MinuteRate);

      const sumMinuteRate2 = filteredTimeFrames?.reduce((acc, timeFrame) => {
        return acc + timeFrame.MinuteRate;
      }, 0);

      setValue('LifeTimeVisitedWorkingTimeMin2', sumMinuteRate2);
    };

    const calculateTime = (
      pg: number,
      material: number,
      distance: number,
      hourlyRate: number,
      initialTime: number
    ): number => {
      // Calculate labor costs
      const totalCost = material + distance;

      const factor = getPgFactor(pg, totalCost);

      const laborCost = totalCost * (factor - 1);

      // Calculate repair time
      return Math.round(laborCost / hourlyRate) - initialTime;
    };

    const getPgFactor = (productGroup: number, totalCost: number) => {
      const factors = getFactors(productGroup);
      return getFactorValueFromTotalCost(factors, totalCost);
    };

    const getFactorValueFromTotalCost = (factors: Factor[], totalCost: number): number => {
      for (let i = 0; i < factors.length; i++) {
        const factor = factors[i];
        const fromAccount =
          factor.tabFactor.FromAccount === null || totalCost >= (factor.tabFactor.FromAccount ?? 0);
        const toAccount =
          factor.tabFactor.ToAccount === null || totalCost < (factor.tabFactor.ToAccount ?? 0);

        if (fromAccount && toAccount) return factor.tabFactor.Factor;
      }

      return 0;
    };

    const getFactors = (productGroup: number): Factor[] => {
      let pgn = null;
      const pgData = calculationPGsData.find((x) => x.ProductGroup === productGroup);

      if (pgData === null || pgData === undefined) {
        pgn = null;
      } else {
        pgn = productGroup;
      }

      const calculationPGs = calculationPGsData.filter(
        (x) =>
          x.ProductGroup === pgn && calculationData.some((y) => y.Id === x.SamKvAutoCalculation)
      );

      const calculationPGFactors = calculationPGFactorsData.filter((x) =>
        calculationPGs.some((y) => y.Id === x.SamKvAutoCalculationPGId)
      );

      const calculationFactors = calculationFactorsData.filter((x) =>
        calculationPGFactors.some((y) => y.SamKvAutoCalculationFactorId === x.Id)
      );

      return calculationFactors.map((calculationFactor) => {
        return {
          version: -1,
          tabFactor: calculationFactor,
        };
      });
    };

    return (
      <Grid container spacing={2} p={'24px'} columnSpacing={'24px'}>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('TOTAL_MATERIALS_INCLUDE_SMALL_PARTES_ET')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled
            fullWidth
            size="small"
            type="number"
            {...register('TotalMaterialsOperation', { valueAsNumber: true })}
            value={
              getValues('TotalMaterialsOperation')
                ? getValues('TotalMaterialsOperation').toFixed(6)
                : getValues('TotalMaterialsOperation')
            }
          />
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled
            fullWidth
            size="small"
            type="number"
            {...register('TotalMaterialsLifeTime', { valueAsNumber: true })}
            value={
              getValues('TotalMaterialsLifeTime')
                ? getValues('TotalMaterialsLifeTime').toFixed(6)
                : getValues('TotalMaterialsLifeTime')
            }
          />
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography pt={'16px'} variant="body2" color={'text.primary'}>
            {t('TRAVEL_EXPENSES')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('KV_OPERATION')}
          </Typography>
          <TextField
            disabled={operatingCostsReadonlyStatus}
            fullWidth
            size="small"
            type="number"
            {...register('OperatingCosts', { valueAsNumber: true })}
          />
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('KV_SERVICE_LIFE')}
          </Typography>
          <TextField
            disabled={lifeTimeTravelCostsReadonlyStatus}
            fullWidth
            size="small"
            type="number"
            {...register('LifeTimeTravelCosts', { valueAsNumber: true })}
          />
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('WORKING_TIME_MINUTES_1ST_VISIT')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled={operatingMinutesReadonlyStatus}
            fullWidth
            size="small"
            type="number"
            {...register('OperatingMinutes', { valueAsNumber: true })}
          />
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled={lifespanOperatingMinutesReadonlyStatus}
            fullWidth
            size="small"
            type="number"
            {...register('LifespanOperatingMinutes', { valueAsNumber: true })}
          />
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('WORKING_TIME_MINUTES_2ND_VISIT')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            type="number"
            {...register('OperatingMinutesInVisit', { valueAsNumber: true })}
          />
        </Grid>
        <Grid item mobile={3.5}>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            type="number"
            {...register('LifeTimeVisitedWorkingTimeMin2', { valueAsNumber: true })}
          />
        </Grid>

        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography pt={'24px'} variant="body2" color={'text.primary'}>
            {t('FIXED_COSTS')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('VAT')}
          </Typography>
          <TextField
            disabled
            fullWidth
            size="small"
            type="number"
            {...register('VatRate', { valueAsNumber: true })}
          />
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('WORK_FRANCS_MINUTE')}
          </Typography>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            {...register('OperatingCostsPerMinute', { valueAsNumber: true })}
            value={
              getValues('OperatingCostsPerMinute')
                ? getValues('OperatingCostsPerMinute').toFixed(4)
                : getValues('OperatingCostsPerMinute')
            }
          />
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography pt={'24px'} variant="body2" color={'text.primary'}>
            {t('PERCENTAGE')}
          </Typography>
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('SMALL_PART')}
          </Typography>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            {...register('SmallClientPercentage', { valueAsNumber: true })}
          />
        </Grid>
        <Grid item mobile={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('ET_PROCESSING_COSTS')}
          </Typography>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            {...register('ProcessingPercentage', { valueAsNumber: true })}
          />
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('TOTAL_INCLUDING_VAT')} {t('INCLUDE_MATERIAL_SMALL_PARTS_ET')}
          </Typography>
        </Grid>
        <Grid item desktop={2.75} mobile={2.5}>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            type="number"
            {...register('IncludeMaterialOperation', { valueAsNumber: true })}
            value={
              getValues('IncludeMaterialOperation')
                ? getValues('IncludeMaterialOperation').toFixed(4)
                : getValues('IncludeMaterialOperation')
            }
          />
        </Grid>
        <Grid item desktop={2.75} mobile={2.5}>
          <TextField
            disabled={true}
            fullWidth
            size="small"
            type="number"
            {...register('IncludeMaterialLifeTime', { valueAsNumber: true })}
            value={
              getValues('IncludeMaterialLifeTime')
                ? getValues('IncludeMaterialLifeTime').toFixed(4)
                : getValues('IncludeMaterialLifeTime')
            }
          />
        </Grid>
        <Grid item desktop={1.5} mobile={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={calculateTotalCosts}
          >
            {t('CALCULATE')}
          </Button>
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('KV_COMMUNICATED_SENT_TO_CUSTOMER')}
          </Typography>
        </Grid>
        <Grid item mobile={3} desktop={3.5}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('KD_NAME')}
          </Typography>
          <TextField
            disabled={informedCustomerNameReadonlyStatus}
            fullWidth
            size="small"
            {...register('CustomerInformedBy')}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>
        <Grid item mobile={2.5} desktop={2}>
          <Typography pb={'8px'} variant="body2" color={'text.primary'}>
            {t('AM')}
          </Typography>
          <Input disabled type="hidden" {...register('CustomerInformedAt')} />
          <TextField
            disabled={customerInformedAtReadOnlyStatus}
            fullWidth
            size="small"
            value={watchFields.CustomerInformedAt ? getDate(watchFields.CustomerInformedAt) : ''}
          />
        </Grid>
        <Grid item mobile={1.5} sx={{ mt: '30px' }}>
          <Button
            disabled={nowButtonDisabledStatus}
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            onClick={() => {
              setValue('CustomerInformedAt', dayjs().toISOString());
            }}
          >
            {t('NOW')}
          </Button>
        </Grid>
        <Grid
          item
          mobile={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={'text.primary'}>
            {t('REMARKS')}
          </Typography>
        </Grid>
        <Grid item mobile={7}>
          <TextField
            disabled={remarksReadonlyStatus}
            fullWidth
            multiline
            rows={3}
            {...register('Remarks')}
            inputProps={{ maxLength: 600 }}
          />
        </Grid>
      </Grid>
    );
  }
);

CostCalculation.displayName = 'CostCalculation';

export default CostCalculation;
