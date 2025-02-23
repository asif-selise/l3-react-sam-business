import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { type IDataMenuSettings } from './types';
import { getData, storeData } from '@/indexedDb';
import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
}

const DataMenuSettings = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const [storedSettings, setStoredSettings] = useState<IDataMenuSettings | null>(null);

  const { control, handleSubmit, setValue } = useForm<IDataMenuSettings>({
    mode: 'onTouched',
    defaultValues: {
      Device: storedSettings?.Device ?? '',
      BluetoothComPort: storedSettings?.BluetoothComPort ?? 0,
      SygicNavigation: storedSettings?.SygicNavigation ?? false,
      GpsSensorComPort: storedSettings?.GpsSensorComPort ?? '',
    },
  });

  const fetchSettings = async () => {
    const settings: IDataMenuSettings = await getData('Settings');
    if (settings) {
      setStoredSettings(settings);
      setValue('Device', settings.Device);
      setValue('BluetoothComPort', settings.BluetoothComPort);
      setValue('SygicNavigation', settings.SygicNavigation);
      setValue('GpsSensorComPort', settings.GpsSensorComPort);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [setValue]);

  const onSubmit: SubmitHandler<IDataMenuSettings> = (formData) => {
    storeData('Settings', JSON.stringify(formData));
    onClose();
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onClose,
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: handleSubmitForm,
        },
      ]}
    />
  );

  const deviceList = [
    { id: 0, value: 'TG euro 1' },
    { id: 1, value: 'SAFETYTEST 1LT' },
  ];

  return (
    <CustomModal variant="md" open onClose={onClose} title={t('SETTINGS')} actions={modalActions}>
      <Card sx={{ mb: 4 }}>
        <Box p={'24px'} display={'flex'} flexDirection="column" rowGap={3}>
          <Typography variant="subtitle2">{t('MEASURING_DEVICE')}</Typography>

          <Controller
            name="Device"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('DEVICE')}</InputLabel>
                <Select {...field} label={t('DEVICE')}>
                  {deviceList.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="BluetoothComPort"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('BLUETOOTH_COM_PORT')} variant="outlined" />
            )}
          />
        </Box>
      </Card>
      <Card sx={{ mb: 4 }}>
        <Box p={'24px'} display={'flex'} flexDirection="column" rowGap={3}>
          <Typography variant="subtitle2">{t('SYGIC_NAVIGATION')}</Typography>
          <Controller
            name="SygicNavigation"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={t('SYGIC_NAVIGATION')}
              />
            )}
          />

          <Controller
            name="GpsSensorComPort"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label={t('Gps Sensor COM Port')} variant="outlined" />
            )}
          />
        </Box>
      </Card>
    </CustomModal>
  );
};

export default DataMenuSettings;
