import { type TableData } from '@/src/components/CustomTable/types';
import { getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  setOpenCopyDeviceToSoModal: Dispatch<SetStateAction<boolean>>;
  activeOrderDeviceRow: TableData | undefined;
  deviceData: ServiceOrderDetail | null;
  onCopyDeviceToSO: (orderDviceData: TableData | undefined) => void;
}

const CopyDeviceToSoConfirmationModal = ({
  open,
  setOpenCopyDeviceToSoModal,
  activeOrderDeviceRow,
  deviceData,
  onCopyDeviceToSO,
}: Props) => {
  const { t } = useTranslation('index');
  const [selectedValue, setSelectedValue] = useState<string>('productionDate');

  const DATES = [
    { id: 'productionDate', value: t('PRODUCTION_DATE') },
    { id: 'installationDate', value: t('INSTALLATION_DATE') },
  ];

  const handleClose = (event: React.MouseEvent | React.KeyboardEvent, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenCopyDeviceToSoModal(false);
  };

  if (activeOrderDeviceRow == null) {
    setOpenCopyDeviceToSoModal(false);
  }

  const renderDetails = (title: string, description: string) => {
    return (
      <Box sx={{ my: 1 }}>
        <Typography variant="subtitle2" color="text.primary" display="inline">
          {title}:
        </Typography>{' '}
        <Typography
          variant="body1"
          color="text.secondary"
          display="inline"
          sx={{ fontSize: '14px' }}
        >
          {sanitizeData(description)}
        </Typography>
      </Box>
    );
  };

  const handleSave = () => {
    if (selectedValue == null) return;

    let updatedOrderDeviceRow = activeOrderDeviceRow;

    if (selectedValue === 'productionDate' && activeOrderDeviceRow?.InstallationDate) {
      updatedOrderDeviceRow = {
        ...activeOrderDeviceRow,
        InstallationDate: deviceData?.CommissioningDate ?? '',
        ProductionDate: getMonthYear(activeOrderDeviceRow?.InstallationDate as string),
      };
    } else {
      updatedOrderDeviceRow = {
        ...activeOrderDeviceRow,
        InstallationDate: activeOrderDeviceRow?.InstallationDate as string,
        ProductionDate: deviceData?.ProductionDate ?? '',
      };
    }

    onCopyDeviceToSO(updatedOrderDeviceRow);
    setOpenCopyDeviceToSoModal(false);
  };

  function getMonthYear(dateString: string) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}.${year}`;
  }

  const getDeviceDate = (value: string) => {
    let deviceDate: string | null = '';
    if (value === 'installationDate') {
      deviceDate = activeOrderDeviceRow?.InstallationDate
        ? getDate(String(activeOrderDeviceRow?.InstallationDate))
        : '-';
    } else {
      deviceDate = activeOrderDeviceRow?.InstallationDate
        ? getMonthYear(activeOrderDeviceRow?.InstallationDate as string)
        : '-';
    }
    return deviceDate ?? '-';
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box style={{ minWidth: '500px', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
        <DialogTitle>{t('CONFIRM_DEVICE_TRANSFER_SO')}</DialogTitle>
      </Box>
      <DialogContent>
        {renderDetails(t('Brand'), activeOrderDeviceRow?.Manufacturer as string)}
        {renderDetails(t('PG'), activeOrderDeviceRow?.ProductGroup as string)}
        {renderDetails(t('MODEL'), activeOrderDeviceRow?.Model as string)}
        {renderDetails(t('SNr'), activeOrderDeviceRow?.SerialNumber as string)}
        {renderDetails(t('PNr'), activeOrderDeviceRow?.ProductNumber as string)}

        <Typography variant="subtitle2" color="text.primary" sx={{ mt: 1 }}>
          {t('Select a date')}
        </Typography>
        <RadioGroup
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
          }}
        >
          {DATES.map(({ id, value }) => (
            <FormControlLabel
              key={id}
              value={id}
              control={<Radio />}
              label={renderDetails(value, getDeviceDate(id))}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenCopyDeviceToSoModal(false);
          }}
          variant={'outlined'}
          color={'primary'}
        >
          {t('NO')}
        </Button>
        <Button onClick={handleSave} variant={'contained'} color={'primary'}>
          {t('YES')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDeviceToSoConfirmationModal;
