import { type Dispatch, type SetStateAction } from 'react';
import ScanQRCode from './components/ScanQRCode/ScanQRCode';
import SearchQRCode from './components/SearchQRCode/SearchQRCode';
import SelectOption, { type SelectOptionItem } from '@/src/components/SelectOption/SelectOption';
import { useTranslation } from 'react-i18next';
interface Props {
  currentView: 'scan' | 'search';
  setCurrentView: Dispatch<SetStateAction<'scan' | 'search'>>;
  openScanOption: boolean;
  setOpenScanOption: Dispatch<SetStateAction<boolean>>;
  scanOption: 'discard' | 'replace' | null;
  setScanOption: Dispatch<SetStateAction<'discard' | 'replace' | null>>;
}

const QRCode = ({
  currentView,
  setCurrentView,
  openScanOption,
  setOpenScanOption,
  scanOption,
  setScanOption,
}: Props) => {
  const { t } = useTranslation('index');

  const options: SelectOptionItem[] = [
    {
      onClick: () => {
        setOpenScanOption(false);
        setScanOption('discard');
        setCurrentView('scan');
      },
      label: t('DISCARD_QR'),
    },
    {
      onClick: () => {
        setOpenScanOption(false);
        setScanOption('replace');
        setCurrentView('scan');
      },
      label: t('REPLACE_QR'),
    },
  ];

  return (
    <>
      {currentView === 'search' && (
        <>
          <SearchQRCode />

          {openScanOption && (
            <SelectOption
              title={t('SELECT_OPTION_TO_PROCEED')}
              options={options}
              onClose={() => {
                setOpenScanOption(false);
              }}
            />
          )}
        </>
      )}

      {currentView === 'scan' && scanOption && <ScanQRCode scanOption={scanOption} />}
    </>
  );
};

export default QRCode;
