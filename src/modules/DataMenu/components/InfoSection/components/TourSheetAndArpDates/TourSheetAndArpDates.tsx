import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button } from '@mui/material';
import { type TourSheetAndArpDatesQueryFields } from './interfaces';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { type TableData } from '@/src/components/CustomTable/types';
import TourSheetAndArpListTable from './components/TourSheetTable/TourSheetAndArpListTable';
import useTourSheetAndArpAppointments from '@/src/hooks/useTourSheetAndArpAppointments/useTourSheetAndArpAppointments.hook';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const TourSheetAndArpDates = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const technicianDataResponse = useTechnicianData();
  const [technicianId, setTechnicianId] = useState<number | null>();

  const {
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<TourSheetAndArpDatesQueryFields>({
    mode: 'onTouched',
    defaultValues: {
      FromDate: null,
      ToDate: null,
    },
  });

  const watchFromDate = watch('FromDate');

  const {
    data,
    refetch: refetchTourSheetAndArpAppointments,
    isLoading,
  } = useTourSheetAndArpAppointments(
    watch('FromDate')?.format('YYYY-MM-DD') ?? '',
    watch('ToDate')?.format('YYYY-MM-DD') ?? '',
    technicianId ?? null
  );

  const handleModalClose = () => {
    onClose(false);
  };

  useEffect(() => {
    if (technicianDataResponse?.data?.technicianId) {
      setTechnicianId(technicianDataResponse?.data?.technicianId);
    }
  }, [technicianDataResponse.isSuccess]);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: handleModalClose,
          variant: 'outlined',
        },
      ]}
    />
  );

  const handleApplyFilter = () => {
    refetchTourSheetAndArpAppointments();
  };

  return (
    <CustomModal
      open
      onClose={handleModalClose}
      title={t('TOUR_SHEET_AND_ARP_DATES')}
      actions={modalActions}
      variant="md"
    >
      <Box display="flex" justifyContent="space-between" alignItems="stretch" gap={2} mb={3}>
        <Box width="45%">
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
        <Box width="45%">
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
        <Box width="10%">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            disabled={!isDirty}
            onClick={handleApplyFilter}
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            {t('FILTER')}
          </Button>
        </Box>
      </Box>
      <TourSheetAndArpListTable
        data={(data as unknown as TableData[]) ?? []}
        isLoading={isLoading}
      />
    </CustomModal>
  );
};

export default TourSheetAndArpDates;
