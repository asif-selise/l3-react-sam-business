import Iconify from '@/src/components/iconify/iconify';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type SamOffer,
  type InstallationChecklist,
  type PersonalEffort,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import {
  type SamOfferType,
  type WorkflowItemDD,
} from '@/src/hooks/useMasterData/masterData.interface';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { Controller, useForm } from 'react-hook-form';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';
import { type updateDataStructure } from '@/src/hooks/useUpdateAPI/updateDataModel';
import { useSelector } from '@/src/redux/store';
import { formatCurrency } from '@/src/helpers/formatCurrency';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import { getNonEmptyValueOrNull } from '@/src/helpers/sanitizeData';
import { type StatusModalData, type StatusModalType } from './types';

const WROKFLOW_ITEM_VERRECHNEN: number = 73;

interface Props {
  sOData: ServiceOrderDetail | null;
  getSOData: <K extends keyof ServiceOrderDetail>(
    key: K,
    value: ServiceOrderDetail[K]
  ) => Promise<void>;
  sODataList: ServiceOrderDetail[];
  getSODataList: () => Promise<ServiceOrderDetail[] | null>;
  updateSODataList: <K extends keyof ServiceOrderDetail>(
    updatedFilteredDataList: ServiceOrderDetail[],
    filteredKey: K,
    filteredValue: ServiceOrderDetail[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
  isLoading: boolean;
  SORep: number;
  statusChangeCallback: (status: number | null) => void;
}

const ExpenseCalculator = ({
  sOData,
  getSOData,
  sODataList,
  getSODataList,
  updateSODataList,
  isLoading,
  SORep,
  statusChangeCallback,
}: Props) => {
  const { t } = useTranslation('index');
  const serviceOrderID = useSelector((state) => state.serviceOrder.id);
  const isReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const dispatch = useDispatch();
  const [numberOfSO, setNumberOfSO] = useState<number>(0);
  const [traveAllowance, setTraveAllowance] = useState<number>(0);
  const [calculatorIsActive, setCalculatorIsActive] = useState<boolean>(!isReadOnly);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [filteredWorkflowList, setFilteredWorkflowList] = useState<WorkflowItemDD[] | null>(null);

  const [confirmationModalType, setConfirmationModalType] = useState<StatusModalType | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [confirmationModalText, setConfirmationModalText] = useState<string>('');
  const [nonAnsweredChecklist, setNonAnsweredChecklist] = useState<boolean>(false);
  const [statusConfirmationModalList, setStatusConfirmationModalList] = useState<
    StatusModalData[] | null
  >(null);

  const { dataList: workflowList, getDataList: getWorkflowList } = useIndexedDbData<WorkflowItemDD>(
    'MasterData',
    'WorkflowItemDDs'
  );

  const { filteredDataList: personalExpensesData, getFilteredDataList: fetchPersonalExpenses } =
    useIndexedDbData<PersonalEffort>('TourPlanData', 'PersonalEfforts');

  const { filteredDataList: installationChecklist, getFilteredDataList: getInstallationChecklist } =
    useIndexedDbData<InstallationChecklist>('TourPlanData', 'InstallationChecklist');

  const { getCustomFilteredDataList: getOfferList } = useIndexedDbData<SamOffer>(
    'TourPlanData',
    'SamOffers'
  );

  const { getDataList: getSamOfferTypes } = useIndexedDbData<SamOfferType>(
    'MasterData',
    'SamOfferTypes'
  );

  const { control } = useForm<any>({
    mode: 'onTouched',
    defaultValues: {
      status: null,
    },
  });

  const handleNumberOfSO = (action: 'increment' | 'decrement') => {
    let currentNumberOfSO = numberOfSO;
    if (action === 'increment') currentNumberOfSO++;
    if (action === 'decrement' && currentNumberOfSO > 1) currentNumberOfSO--;
    setNumberOfSO(currentNumberOfSO);
    if (currentNumberOfSO > 0) handleTravelAllowance(currentNumberOfSO);
  };

  const handleTravelAllowance = (currentNumberOfSO: number) => {
    const updatedTraveAllowance = Number((100 / currentNumberOfSO).toFixed(2));
    setTraveAllowance(updatedTraveAllowance);
    handleSODataUpdate(currentNumberOfSO, updatedTraveAllowance);
  };

  const handleSODataUpdate = (currentNumberOfSO: number, updatedTraveAllowance: number) => {
    setCalculatorIsActive(false);

    if (sOData && workflowList) {
      const updatedSOData: ServiceOrderDetail = {
        ...sOData,
        AdditionalMinutes: currentNumberOfSO,
        TravelAllowancePercentage: updatedTraveAllowance,
      };
      updateSOData(updatedSOData);
      dispatch(showSuccessMessage(t('EXPENSE_UPDATED_SUCCESSFULLY')));
    } else {
      dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
      setCalculatorIsActive(true);
    }
  };

  const updateSOData = async (updatedSOData: ServiceOrderDetail) => {
    if (sOData && !isLoading) {
      const updatedSODataList: ServiceOrderDetail[] = sODataList.map((item) =>
        item.OrderId === sOData.OrderId ? updatedSOData : item
      );
      await updateSODataList(
        updatedSODataList,
        'OrderId',
        Number(serviceOrderID),
        updatedSOData,
        'UpdateRecords',
        'ServiceOrderDetailsUpdateRequestModel'
      );
    } else {
      dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
    }
    await getSOData('OrderId', Number(serviceOrderID));
    await getSODataList();
    setCalculatorIsActive(true);
  };

  const handleStatusChange = (value: number | null) => {
    setCalculatorIsActive(false);
    setSelectedStatusId(value);
    statusChangeCallback(value);
    if (sOData) {
      const updatedSOData: ServiceOrderDetail = {
        ...sOData,
        WorkflowItemRs: value,
      };
      updateSOData(updatedSOData);
      if (value != null) dispatch(showSuccessMessage(t('STATUS_UPDATED_SUCCESSFULLY')));
    } else {
      dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
      setCalculatorIsActive(true);
    }
  };

  const handleOpenConfirmationModal = (type: StatusModalType, text: string) => {
    setConfirmationModalType(type);
    setOpenConfirmationModal(true);
    setConfirmationModalText(text);
  };

  const handleConfirmationModalAction = (actionType: 'YES' | 'NO') => {
    setOpenConfirmationModal(false);
    setConfirmationModalText('');
    setConfirmationModalType('');

    if (confirmationModalType === 'non-answered-checklist') {
      setSelectedStatusId(null);
      handleStatusChange(null);
      setStatusConfirmationModalList([]);
      return;
    }

    if (
      confirmationModalType === 'siko-aouthorized-s' ||
      confirmationModalType === 'siko-aouthorized-gm'
    ) {
      if (sOData) {
        const updatedSOData: ServiceOrderDetail = {
          ...sOData,
          IsSikoAuthorized: actionType === 'YES',
        };
        updateSOData(updatedSOData);
      } else {
        dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
        setCalculatorIsActive(true);
      }
    }

    if (statusConfirmationModalList?.length) {
      const modalList: StatusModalData[] = [...statusConfirmationModalList];
      const statusChangeWarningMessage = modalList.at(-1);

      if (statusChangeWarningMessage) {
        handleOpenConfirmationModal(
          statusChangeWarningMessage.modalType,
          statusChangeWarningMessage.message
        );
      }

      modalList.pop();
      setStatusConfirmationModalList(modalList);
    } else if (selectedStatusId) {
      handleStatusChange(selectedStatusId);
    }
  };

  const checkOfferValidation = async () => {
    const samOfferTypes = await getSamOfferTypes();

    const offerType11 = samOfferTypes?.find((item) => item.SamOfferTypeId === 11);
    const isInactive = offerType11 ? offerType11.IsInactive : undefined;

    if (!isInactive) {
      const offerList = await getOfferList(
        (item) => item.OrderId === Number(serviceOrderID) || item.OrderId === SORep
      );

      const msg = [];
      for (const offer of offerList) {
        if (!offer.isNewOffer) {
          if (!offer.TakenOverUser) {
            msg.push(
              `• ${t('SAM_OFFER_ID')} ${offer.SamOfferId} ${t('HAS_EMPTY_TAKEN_OVER_USER')}`
            );
          }
        }
      }

      if (msg.length) return msg.join('\n');
    }

    return '';
  };

  const handleStatusChangeConfirmationModal = async (value: number) => {
    const hasEmptyTakenOverUser = await checkOfferValidation();
    const modalList: StatusModalData[] = [];

    setSelectedStatusId(value);

    if (hasEmptyTakenOverUser !== '') {
      modalList.push({ modalType: 'has-empty-taken-over-user', message: hasEmptyTakenOverUser });
    }

    if (personalExpensesData.length === 0) {
      modalList.push({
        modalType: 'empty-personal-expenses',
        message: t('YOU_HAVE_NOT_ENTERED_ANY_WORKING_TIME'),
      });
    }

    if (
      value === WROKFLOW_ITEM_VERRECHNEN &&
      (getNonEmptyValueOrNull(sOData?.FaultReport) === null ||
        getNonEmptyValueOrNull(sOData?.FaultReportOrder) === null)
    ) {
      modalList.push({
        modalType: 'verrechnen-status',
        message: t('PLEASE_COMPLETE_INVOICE_TEXT', {
          invoiceText: sOData?.FaultReport,
          report: sOData?.FaultReportOrder,
        }),
      });
    }

    if (sOData?.IsSikoAuthorized === null) {
      if (sOData?.Group === 'S') {
        modalList.push({
          modalType: 'siko-aouthorized-s',
          message: t('HAS_AN_ELECTRICAL_COMPONENT_BEEN_REPLACED'),
        });
      } else if (sOData?.Group === 'G' || sOData?.Group === 'M') {
        if (sOData?.HasFixedConnection) {
          if (sOData) {
            const updatedSOData: ServiceOrderDetail = {
              ...sOData,
              IsSikoAuthorized: true,
            };
            updateSOData(updatedSOData);
          } else {
            dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
            setCalculatorIsActive(true);
          }
        } else {
          modalList.push({
            modalType: 'siko-aouthorized-gm',
            message: t('DID_THE_3_PIN_TYPE'),
          });
        }
      }
    }

    if (nonAnsweredChecklist) {
      modalList.push({
        modalType: 'non-answered-checklist',
        message: t('PLEASE_ANSWER_ALL_CHECK_QUESTIONS'),
      });
    }

    if (modalList.length) {
      const msg = modalList.at(-1);

      if (msg) handleOpenConfirmationModal(msg.modalType, msg.message);
      modalList.pop();
      setStatusConfirmationModalList(modalList);
    } else {
      handleStatusChange(value);
    }
  };

  const isDecrementButtonDisabled = () => numberOfSO <= 1 || !calculatorIsActive;

  const getDecrementButtonColor = () =>
    isReadOnly || isDecrementButtonDisabled() ? COMMON.grey[200] : 'primary.main';

  const getIncrementButtonColor = () =>
    isReadOnly || !calculatorIsActive ? COMMON.grey[200] : 'primary.main';

  useEffect(() => {
    if (serviceOrderID) {
      getSOData('OrderId', Number(serviceOrderID));
      getSODataList();
      getWorkflowList();
      fetchPersonalExpenses('OrderId', Number(serviceOrderID)).then();
      getInstallationChecklist('OrderId', serviceOrderID);
    }
  }, [serviceOrderID]);

  useEffect(() => {
    if (sOData?.AdditionalMinutes) {
      setNumberOfSO(sOData.AdditionalMinutes);
    }
    if (sOData?.TravelAllowancePercentage) {
      setTraveAllowance(sOData.TravelAllowancePercentage);
    }
    if (sOData?.WorkflowItemRs) {
      setSelectedStatusId(sOData.WorkflowItemRs);
    }
  }, [sOData]);

  useEffect(() => {
    if (workflowList && sOData) {
      let filteredData = workflowList.filter(
        (x) => x.IsActive && (sOData.IsAutoChargeAllowed || x.Id !== WROKFLOW_ITEM_VERRECHNEN)
      );

      if (sOData?.Group === 'G' || sOData?.Group === 'M') {
        filteredData = filteredData.filter((x) => x.Id !== 1);
      } else {
        filteredData = filteredData.filter((x) => x.Id !== 67);
      }
      setFilteredWorkflowList(filteredData);
    }
  }, [workflowList, sOData]);

  useEffect(() => {
    if (sOData?.Group === 'G' || sOData?.Group === 'M' || installationChecklist?.length === 0) {
      setNonAnsweredChecklist(false);
      return;
    }
    const checklistStatus = installationChecklist.find((x) => x.Answer === null);

    if (checklistStatus) setNonAnsweredChecklist(true);
    else setNonAnsweredChecklist(false);
  }, [installationChecklist, sOData]);

  return (
    <Card aria-label="Expense Calculator">
      <CardHeader title={t('EXPENSE_CALCULATOR')} />
      {sOData ? (
        <Box padding={'24px 24px 36px 24px'}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={2.5}>
            <Typography variant="subtitle2" color={'text.primary'} width={'40%'}>
              {t('NUMBER_OF_SO')}
            </Typography>
            <Box
              width={'100%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              columnGap={2}
            >
              <Button
                aria-label="Decrement Button"
                onClick={() => {
                  handleNumberOfSO('decrement');
                }}
                sx={{
                  pl: '4px',
                  pr: '4px',
                  width: '60px',
                  height: '52px',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: getDecrementButtonColor(),
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                disabled={isReadOnly || isDecrementButtonDisabled()}
              >
                <Iconify
                  icon={'flowbite:minus-outline'}
                  sx={{
                    color: getDecrementButtonColor(),
                  }}
                />
              </Button>
              <TextField
                name="Number of SO Field"
                fullWidth
                disabled={isReadOnly || !calculatorIsActive}
                type="number"
                value={numberOfSO}
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    '& input[type=number]::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                    },
                  },
                  inputProps: {
                    style: {
                      textAlign: 'center',
                    },
                  },
                }}
              />
              <Button
                aria-label="Increment Button"
                sx={{
                  pl: '4px',
                  pr: '4px',
                  width: '60px',
                  height: '52px',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: getIncrementButtonColor(),
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => {
                  handleNumberOfSO('increment');
                }}
                disabled={isReadOnly || !calculatorIsActive}
              >
                <Iconify
                  icon={'flowbite:plus-outline'}
                  sx={{
                    color: getIncrementButtonColor(),
                  }}
                />
              </Button>
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={2.5}>
            <Typography variant="subtitle2" color={'text.primary'} width={'40%'}>
              {t('STATUS')}
            </Typography>

            <Controller
              aria-label="Status Dropdown"
              name="status"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  disabled={isReadOnly || !calculatorIsActive}
                  options={filteredWorkflowList ?? []}
                  value={workflowList.find((x) => x.Id === selectedStatusId) ?? null}
                  getOptionLabel={(option) => option.Item ?? ''}
                  onChange={(event, newValue) => {
                    field.onChange(newValue?.Id ?? null);
                    if (newValue?.Id) handleStatusChangeConfirmationModal(newValue.Id);
                  }}
                  slotProps={{
                    popper: {
                      placement: 'left',
                      sx: {
                        zIndex: 9999,
                        width: 'auto !important',
                        maxWidth: '50vh',
                        '& .MuiAutocomplete-listbox': {
                          maxHeight: '95vh',
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={2.5}>
            <Typography variant="subtitle2" color={'text.primary'} width={'40%'}>
              {t('TRAVEL_ALLOWANCE')}
            </Typography>
            <TextField
              fullWidth
              disabled
              value={`${traveAllowance}%`}
              InputProps={{
                sx: {
                  textAlign: 'center',
                },
                inputProps: {
                  style: {
                    textAlign: 'center',
                  },
                },
              }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={2.5}>
            <Typography variant="subtitle2" color={'text.primary'} width={'40%'}>
              {t('RE_TOTAL')}
            </Typography>
            <TextField
              fullWidth
              disabled
              type="number"
              value={formatCurrency(sOData?.InvoiceTotal)}
              InputProps={{
                endAdornment: <InputAdornment position="start">Fr.</InputAdornment>,
                sx: {
                  textAlign: 'center',
                },
                inputProps: {
                  style: {
                    textAlign: 'center',
                  },
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: '24px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={confirmationModalText}
          discardButton={{
            title:
              confirmationModalType === 'empty-personal-expenses' ||
              confirmationModalType === 'non-answered-checklist' ||
              confirmationModalType === 'verrechnen-status' ||
              confirmationModalType === 'has-empty-taken-over-user'
                ? t('OK')
                : t('NO'),
            variant: 'contained',
            action: () => {
              handleConfirmationModalAction('NO');
            },
          }}
          {...((confirmationModalType === 'siko-aouthorized-gm' ||
            confirmationModalType === 'siko-aouthorized-s') && {
            primaryActionButton: {
              title: t('YES'),
              actionId: '',
              variant: 'contained',
              color: 'primary',
              action: () => {
                handleConfirmationModalAction('YES');
              },
            },
          })}
        />
      )}
    </Card>
  );
};

export default ExpenseCalculator;
