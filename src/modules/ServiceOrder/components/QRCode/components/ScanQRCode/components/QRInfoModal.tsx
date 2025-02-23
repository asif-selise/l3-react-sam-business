import { Alert, Box, Typography } from '@mui/material';
import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import InfoGridV2 from '@/src/components/InfoGridV2/InfoGridV2';
import { type DeviceInfoFromGuid } from '@/src/hooks/useGetDeviceInfoFromGuid/interface';
import { getDate } from '@/src/helpers/formatDate';

interface Props {
  data: DeviceInfoFromGuid;
  errorMessage: string[];
}

const QRInfoModal = ({ data, errorMessage }: Props) => {
  const { t } = useTranslation('index');

  return (
    <Box minWidth={'700px'} maxWidth={'980px'}>
      <Box display={'flex'} alignItems={'center'} mt={'20px'}>
        <InfoIcon sx={{ mr: 2, fontSize: '40px', color: 'primary.lighter' }} />
        <Typography variant="body1"> {t('CLIENT_OF_THE_ADMINISTRATION_SERVICE7000_AG')}</Typography>
      </Box>

      {errorMessage && (
        <Box mt={2} display={'flex'} flexDirection={'column'} rowGap={1}>
          {errorMessage.map((error, index) => (
            <Alert key={index} severity="error" variant="filled">
              {error}
            </Alert>
          ))}
        </Box>
      )}

      <Box pl={7} mt={2} pr={3} display={'flex'} justifyContent={'space-between'} columnGap={4}>
        <Box width={'50%'}>
          <Typography variant="subtitle1" mt={2}>
            {t('DEVICE_INFORMATION')}
          </Typography>
          <InfoGridV2
            label={{
              value: `${t('PRODUCT_ID')} :`,
            }}
            value={{
              value: sanitizeData(data.ProductId),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('MARKE')} :`,
            }}
            value={{
              value: sanitizeData(data.ManufacturerName),
            }}
          />
          <InfoGridV2
            label={{
              value: `PG :`,
            }}
            value={{
              value: sanitizeData(data.ProductGroup),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('MODEL')} :`,
            }}
            value={{
              value: sanitizeData(data.Model),
            }}
          />
          <InfoGridV2
            label={{
              value: `SNR :`,
            }}
            value={{
              value: sanitizeData(data.SerialNumber),
            }}
          />
          <InfoGridV2
            label={{
              value: `PNR :`,
            }}
            value={{
              value: sanitizeData(data.ProductNumber),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('INSTALLATION_DATE')} :`,
            }}
            value={{
              value: sanitizeData(getDate(data.InstallationDate)),
            }}
          />
        </Box>
        <Box width={'50%'}>
          <Typography variant="subtitle1" mt={2}>
            {t('OBJECT_ADDRESS')}
          </Typography>
          <InfoGridV2
            label={{
              value: `${t('STREET')} :`,
            }}
            value={{
              value: sanitizeData(data.StreetDisplay),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('NO')} :`,
            }}
            value={{
              value: sanitizeData(data.AdditionalStreetDisplay),
            }}
          />
          <InfoGridV2
            label={{
              value: `PLZ :`,
            }}
            value={{
              value: sanitizeData(data.ObjectPostalCode),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('LOCATION')} :`,
            }}
            value={{
              value: sanitizeData(data.ObjectCity),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('REMARKS')} :`,
            }}
            value={{
              value: sanitizeData(data.ObjectRemarks),
            }}
          />
        </Box>
      </Box>
      <Box pl={7} mt={2} pr={3} display={'flex'} justifyContent={'space-between'} columnGap={4}>
        <Box width={'50%'}>
          <Typography variant="subtitle1" mt={2}>
            {t('SERVICE_REQUEST')}
          </Typography>
          <InfoGridV2
            label={{
              value: `${t('ALLOW_AUTOMATICALLY')} :`,
            }}
            value={{
              value: sanitizeData(data.AutoServiceRequestAllowed),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('APARTMENT_ID')} :`,
            }}
            value={{
              value: sanitizeData(data.ApartmentObjectId),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('APARTMENT_NUMBER_KD')} :`,
            }}
            value={{
              value: sanitizeData(data.ApartmentCustomerNumber),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('REMARKS')} :`,
            }}
            value={{
              value: sanitizeData(data.ApartmentObjectRemarks),
            }}
          />
        </Box>
        <Box width={'50%'}>
          <Typography variant="subtitle1" mt={2}>
            {t('ADMINISTRATION_OF_SERVICE7000_AG')}
          </Typography>
          <InfoGridV2
            label={{
              value: `${t('ADMINISTRATIVE_NUMBER')} :`,
            }}
            value={{
              value: sanitizeData(data.ManagementId),
            }}
          />
          <InfoGridV2
            label={{
              value: `${t('ADDRESS')} :`,
            }}
            value={{
              value: sanitizeData(data.ManagementAddress),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default QRInfoModal;
