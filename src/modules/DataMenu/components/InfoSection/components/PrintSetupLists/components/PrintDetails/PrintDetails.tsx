import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { type PrintDetailsFields } from '../PrintTable/interfaces';
import dayjs from 'dayjs';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type SamPrinter,
  type Branch,
  type TempTechnician,
} from '@/src/hooks/useMasterData/masterData.interface';

interface Props {
  onFilter: (queryValues: PrintDetailsFields) => void;
}

const TechnicianEmployeeNumberTypes = [
  { id: 1, value: 'Alle' },
  { id: 2, value: 'EB' },
  { id: 3, value: 'ST' },
];

const PrintDetails = ({ onFilter }: Props) => {
  const { t } = useTranslation('index');
  const {
    dataList: printerList,
    getDataList: getPrinterList,
    isLoading: printerIsLoading,
  } = useIndexedDbData<SamPrinter>('MasterData', 'SamPrinters');
  const {
    dataList: branchesList,
    getDataList: getBranchesList,
    isLoading: branchesIsLoading,
  } = useIndexedDbData<Branch>('MasterData', 'Branches');
  const {
    dataList: filteredTechnicianList,
    getFilteredDataList: getFilteredTechnicianList,
    isLoading: technicianIsLoading,
  } = useIndexedDbData<TempTechnician>('MasterData', 'TempTechnician');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PrintDetailsFields>({
    mode: 'onTouched',
    defaultValues: {
      tourDate: '',
      mA_NM: [],
      technicianEmployeeNumberType: TechnicianEmployeeNumberTypes[0].value,
      branch: '',
    },
  });

  const onSubmit: SubmitHandler<PrintDetailsFields> = async (formData) => {
    onFilter(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleClearAll = () => {
    reset();
  };

  useEffect(() => {
    getBranchesList();
    getPrinterList();
    getFilteredTechnicianList('IsInactive', false);
  }, []);

  return (
    <Card>
      <CardHeader title={t('PRINT_DETAILS')} />
      {!printerIsLoading && !branchesIsLoading && !technicianIsLoading && (
        <Box p={'24px'}>
          <Box display={'flex'} columnGap={3}>
            <Controller
              name="tourDate"
              control={control}
              rules={{ required: t('FIELD_IS_REQUIRED') }}
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    value={value ? dayjs(value) : null}
                    onChange={(date) => {
                      onChange(date ? date.format('YYYY-MM-DD') : '');
                    }}
                    label={t('TOUR_DATE')}
                    format="DD.MM.YYYY"
                    sx={{ width: '100%' }}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        InputLabelProps: { shrink: true },
                        error: !!errors.tourDate,
                        helperText: errors.tourDate?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />

            <FormControl fullWidth>
              <InputLabel>{t('MA_NM')}</InputLabel>
              <Controller
                name="mA_NM"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t('MA_NM')}
                    multiple
                    value={field.value ?? []}
                    renderValue={(selected: number[]) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.toString()} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {filteredTechnicianList.map((technician) => (
                      <MenuItem key={technician.Id} value={technician.TechnicianEmployeeNumber}>
                        {technician.TechnicianEmployeeNumber}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel aria-label="Printer">{t('PRINTER')}</InputLabel>
              <Select label={t('PRINTER')}>
                {printerList.map((printer) => (
                  <MenuItem key={printer.Id} value={printer.Name}>
                    {printer.Display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display={'flex'} columnGap={3} mt={3} alignItems={'baseline'}>
            <Controller
              name="technicianEmployeeNumberType"
              control={control}
              rules={{ required: t('FIELD_IS_REQUIRED') }}
              defaultValue={TechnicianEmployeeNumberTypes[0].value}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.technicianEmployeeNumberType}>
                  <InputLabel>{t('TECHNICIAN_EMPLOYEE_NUMBER_TYPE')}</InputLabel>
                  <Select {...field} label={t('TECHNICIAN_EMPLOYEE_NUMBER_TYPE')}>
                    {TechnicianEmployeeNumberTypes.map((type) => (
                      <MenuItem key={type.id} value={type.value}>
                        {type.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.technicianEmployeeNumberType && (
                    <Typography color="error" variant="body2">
                      {errors.technicianEmployeeNumberType.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Typography variant="body2">{t('PLACE_OF_INNOVATION')}</Typography>

            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('BRANCH_ID')}</InputLabel>
                  <Select {...field} label={t('BRANCH_ID')}>
                    {branchesList
                      ?.filter((branch) => branch.Id <= 3)
                      .map((branch) => (
                        <MenuItem key={branch.Id} value={branch.Id}>
                          {branch.Name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box mt={3} display={'flex'} justifyContent={'flex-end'} columnGap={3}>
            <Button
              color="error"
              variant="outlined"
              startIcon={<ClearIcon />}
              disabled={!isDirty}
              onClick={handleClearAll}
            >
              {t('CLEAR_ALL')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<FilterListIcon />}
              disabled={!isDirty}
              onClick={handleSubmitForm}
            >
              {t('FILTER')}
            </Button>
          </Box>
        </Box>
      )}
      {printerIsLoading ||
        branchesIsLoading ||
        (technicianIsLoading && (
          <Box
            aria-label="Circular Progress"
            sx={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ))}
    </Card>
  );
};

export default PrintDetails;
