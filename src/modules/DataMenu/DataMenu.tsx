import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import StickyContainer from '@/src/components/StickyContainer/StickyContainer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoSection from './components/InfoSection/InfoSection';
import OrderSection from './components/OrderSection/OrderSection';
import ReportSection from './components/ReportSection/ReportSection';
import SettingsSection from './components/SettingsSection/SettingsSection';

const DataMenu = () => {
  const { t } = useTranslation('index');

  return (
    <>
      <StickyContainer>
        <CustomBreadcrumbs heading={t('DATA_OVERVIEW')} links={[{ name: '' }]} />
      </StickyContainer>

      <InfoSection />
      <OrderSection />
      <ReportSection />
      <SettingsSection />
    </>
  );
};

export default DataMenu;
