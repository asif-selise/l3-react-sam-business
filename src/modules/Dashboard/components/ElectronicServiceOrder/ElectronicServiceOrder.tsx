import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ESO from './components/ESO/ESO';

const ElectronicServiceOrder = () => {
  const { t } = useTranslation('index');

  const [openCreateESO, setOpenCreateESO] = useState(false);

  const buttonCreateESO = (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setOpenCreateESO(true);
        }}
        size="medium"
      >
        {t('NEW_ESO')}
      </Button>
    </>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={t('ELECTRONIC_SERVICE_ORDER')}
        links={[
          {
            name: t('DASHBOARD'),
            href: '/sam/dashboard',
          },
          { name: 'ESO' },
        ]}
        buttons={buttonCreateESO}
      />

      <ESO openCreateESO={openCreateESO} setOpenCreateESO={setOpenCreateESO} />
    </>
  );
};

export default ElectronicServiceOrder;
