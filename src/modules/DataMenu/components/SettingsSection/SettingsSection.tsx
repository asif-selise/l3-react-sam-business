import React, { useState } from 'react';
import supplyChainIcon from '@/public/assets/icons/ic_supply_chain.svg';
import CommonSection from '../CommonSection/CommonSection';
import { useTranslation } from 'react-i18next';
import { type ActionCardDetail } from '@/src/components/ActionCard/types';
import DataMenuSettings from './components/DataMenuSettings/DataMenuSettings';

const SettingsSection = () => {
  const { t } = useTranslation('index');
  const [openSettings, setOpenSettings] = useState(false);

  const actionCards: ActionCardDetail[] = [
    {
      icon: supplyChainIcon,
      title: t('SETTINGS'),
      onClick: () => {
        setOpenSettings(true);
      },
    },
  ];

  return (
    <>
      <CommonSection
        actionCards={actionCards}
        header={{
          title: t('SETTINGS'),
        }}
      />

      {openSettings && (
        <DataMenuSettings
          onClose={() => {
            setOpenSettings(false);
          }}
        />
      )}
    </>
  );
};

export default SettingsSection;
