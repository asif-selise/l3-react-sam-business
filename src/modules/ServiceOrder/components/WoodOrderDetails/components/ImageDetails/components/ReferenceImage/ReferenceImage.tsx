import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WoodReferenceImg from '@/public/assets/images/woodReference.png';

const ReferenceImage = () => {
  const { t } = useTranslation('index');

  return (
    <>
      <Typography variant="h6" color="textPrimary" p={'24px 0px 24px 0px'}>
        {t('REFERENCE')}
      </Typography>
      <Box
        component="img"
        src={WoodReferenceImg}
        alt="Appliance image"
        sx={{
          mt: 3,
          mb: 3,
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
    </>
  );
};

export default ReferenceImage;
