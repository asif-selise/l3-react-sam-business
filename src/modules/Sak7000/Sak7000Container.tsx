import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import StickyContainer from '@/src/components/StickyContainer/StickyContainer';
import { useTranslation } from 'react-i18next';
import Sak7000 from './components/Sak7000/Sak7000';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sak7000Container = () => {
  const { t } = useTranslation('index');
  const navigate = useNavigate();

  const navigateToESO = () => {
    navigate('/sam/sak-7000/rs-line');
  };

  const rslineButton = (
    <Button variant="outlined" color="primary" onClick={navigateToESO}>
      {t('RS_LINE')}
    </Button>
  );

  return (
    <>
      <StickyContainer>
        <CustomBreadcrumbs
          heading={t('SAK_7000')}
          links={[{ name: t('SAK_7000') }]}
          buttons={rslineButton}
        />
      </StickyContainer>
      <Sak7000 />
    </>
  );
};

export default Sak7000Container;
