import { Box, Typography } from '@mui/material';
import React from 'react';
import HelpIcon from '@mui/icons-material/Help';
import { useTranslation } from 'react-i18next';

const MeasurementConfirmationModal = () => {
  const { t } = useTranslation('index');

  return (
    <>
      <Box display={'flex'} alignItems={'center'}>
        <HelpIcon sx={{ mr: 2, fontSize: '40px', color: 'primary.lighter' }} />
        <Typography variant="body1">{t('PLEASE_CHECK_THE....POINTS')}</Typography>
      </Box>
      <Box pl={7} mt={2}>
        <Typography variant="body2">{t('NOT_RUNNING_AT_THE_MOMENT')}</Typography>
        <Typography variant="body2">{t('IS_THE_METER_TURNED_ON_AND_ON....SCREEN?')}</Typography>
        <Typography variant="body2">
          {t('IS_THE_MEASURING_DEVICE_CONNECTED_TO_THE_TABLEPC....CORRECTLY?')}
        </Typography>
        <Typography variant="body1" mt={2}>
          {t('IF_YOU_CAN_ANSWER....START_THE_EXAM.')}
        </Typography>
      </Box>
    </>
  );
};

export default MeasurementConfirmationModal;
