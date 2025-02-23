import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import { type InventoryQueryFields } from './interfaces';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';
import useWarehouseStockTurnoverReport from '@/src/hooks/useWarehouseStockTurnoverReport/useWarehouseStockTurnoverReport.hook';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { base64ToBlobUrl } from '@/src/helpers/base64ToBlobUrlConvertion';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const InventoryLists = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const technicianDataResponse = useTechnicianData();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InventoryQueryFields>({
    mode: 'onTouched',
    defaultValues: {
      FromDate: null,
      ToDate: null,
    },
  });

  const watchFromDate = watch('FromDate');

  const {
    refetch: fetchStockTurnoverReport,
    isLoading,
    error,
  } = useWarehouseStockTurnoverReport(
    watch('FromDate')?.format('YYYY-MM-DD') ?? '',
    watch('ToDate')?.format('YYYY-MM-DD') ?? '',
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    technicianDataResponse.data?.technicianEmployeeNumber as number
  );

  const onSubmit: SubmitHandler<InventoryQueryFields> = async (formData) => {
    const { data: base64Pdf } = await fetchStockTurnoverReport();

    if (base64Pdf) {
      window.open(base64ToBlobUrl(base64Pdf), '_blank');
    } else {
      dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
    }
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleModalClose = () => {
    onClose(false);
  };

  useEffect(() => {
    if (error) {
      dispatch(showErrorMessage(t('DATA_FETCH_ERROR')));
    }
    if (technicianDataResponse.isError) {
      dispatch(showErrorMessage(t('DATA_FETCH_ERROR')));
    }
  }, [error, technicianDataResponse.isError]);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: handleModalClose,
          variant: 'outlined',
        },
        {
          label: t('DOWNLOAD_AND_VIEW_LIST'),
          onClick: handleSubmitForm,
        },
      ]}
    />
  );

  return (
    <>
      <CustomModal
        open
        onClose={handleModalClose}
        title={t('WGA_WARENUM_FLAG')}
        actions={modalActions}
        variant="sm"
      >
        {!!isLoading && <LoaderOverlay />}

        <Box display={'flex'} justifyContent={'space-between'} columnGap={2.2}>
          <Box width={'100%'}>
            <Controller
              name="FromDate"
              control={control}
              rules={{
                required: t('FIELD_IS_REQUIRED'),
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    {...field}
                    value={field.value ?? null}
                    label={t('FROM')}
                    format="DD.MM.YYYY"
                    sx={{ width: '100%' }}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.FromDate,
                        helperText: errors.FromDate?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
          <Box width={'100%'}>
            <Controller
              name="ToDate"
              control={control}
              rules={{
                required: t('FIELD_IS_REQUIRED'),
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    {...field}
                    value={field.value ?? null}
                    label={t('TO')}
                    minDate={watchFromDate ?? null}
                    format="DD.MM.YYYY"
                    disabled={!watchFromDate}
                    sx={{ width: '100%' }}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.ToDate,
                        helperText: errors.ToDate?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default InventoryLists;
