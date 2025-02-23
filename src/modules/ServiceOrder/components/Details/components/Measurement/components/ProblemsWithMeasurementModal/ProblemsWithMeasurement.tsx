import { Box, Typography } from '@mui/material';
import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';

const ProblemsWithMeasurement = () => {
  const { t } = useTranslation('index');

  return (
    <>
      <Box display={'flex'} alignItems={'center'}>
        <InfoIcon sx={{ mr: 2, fontSize: '40px', color: 'primary.lighter' }} />
        <Typography variant="body1">{t('IF_THE_MEASUREMENT_CANNOT_BE_STARTED....')}</Typography>
      </Box>
      <Box pl={7} mt={2}>
        <Typography variant="body2">{t('1_CLOSE_THIS_FORM')}</Typography>
        <Typography variant="body2">{t('2_CHECK_WHETHER_MEMORY_CARD....')}</Typography>
        <Typography variant="body2">{t('3_SWITCH_THE_MEASURING_DEVICE_OFF....')}</Typography>
        <Typography variant="body2">{t('4_OPEN_THE_FORM_AGAIN')}</Typography>
        <Typography variant="body1" mt={2}>
          {t('IF_STILL_DOES_NOT_WORK....')}
        </Typography>
        <Typography variant="body2">{t('OF_COURSE_WHEN_USING_THIS....')}</Typography>
      </Box>
    </>
  );
};

export default ProblemsWithMeasurement;
