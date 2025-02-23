import React, { useState } from 'react';
import qrCodeIcon from '@/public/assets/icons/ic_qr_code.svg';
import printerIcon from '@/public/assets/icons/ic_print.png';
import fileIcon from '@/public/assets/icons/ic_file_grey.svg';
import CommonSection from '../CommonSection/CommonSection';
import { useTranslation } from 'react-i18next';
import { type ActionCardDetail } from '@/src/components/ActionCard/types';
import InventoryLists from './components/InventoryLists/InventoryLists';
import PrintSetupLists from './components/PrintSetupLists/PrintSetupLists';
import TourSheetAndArpDates from './components/TourSheetAndArpDates/TourSheetAndArpDates';
import QrCodeInfo from './components/QrCodeInfo/QrCodeInfo';

const InfoSection = () => {
  const { t } = useTranslation('index');
  const [openInventoryLists, setOpenInventoryLists] = useState(false);
  const [openPrintSetupLists, setOpenPrintSetupLists] = useState(false);
  const [openTourSheetAndArpDates, setOpenTourSheetAndArpDates] = useState(false);
  const [openQrCodeInfo, setOpenQrCodeInfo] = useState(false);

  const actionCards: ActionCardDetail[] = [
    {
      icon: qrCodeIcon,
      title: t('QR_CODE_INFO'),
      onClick: () => {
        setOpenQrCodeInfo(true);
      },
    },
    {
      icon: fileIcon,
      title: t('WAREHOUSE_STOCK_REPORT'),
      onClick: () => {
        setOpenInventoryLists(true);
      },
    },
    {
      icon: printerIcon,
      title: t('PRINT_SETUP_LISTS'),
      onClick: () => {
        setOpenPrintSetupLists(true);
      },
    },
    {
      icon: fileIcon,
      title: t('TOUR_SHEET_AND_ARP_DATES'),
      onClick: () => {
        setOpenTourSheetAndArpDates(true);
      },
    },
    // {
    //   icon: navigationIcon,
    //   title: t('OPEN_NAVIGATION'),
    //   onClick: () => {},
    // },
  ];

  return (
    <>
      <CommonSection
        header={{
          title: t('INFORMATION_AND_SEARCH'),
        }}
        actionCards={actionCards}
        aria-Label="info-section"
      />
      {!!openInventoryLists && <InventoryLists onClose={setOpenInventoryLists} />}
      {!!openPrintSetupLists && <PrintSetupLists onClose={setOpenPrintSetupLists} />}
      {!!openTourSheetAndArpDates && <TourSheetAndArpDates onClose={setOpenTourSheetAndArpDates} />}

      {openQrCodeInfo && (
        <QrCodeInfo
          enabledQRInfo={true}
          onClose={() => {
            setOpenQrCodeInfo(false);
          }}
        />
      )}
    </>
  );
};

export default InfoSection;
