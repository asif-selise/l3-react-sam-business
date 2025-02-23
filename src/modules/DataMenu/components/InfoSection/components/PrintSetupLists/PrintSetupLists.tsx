import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import PrintDetails from './components/PrintDetails/PrintDetails';
import PrintTable from './components/PrintTable/PrintTable';
import { type PrintDetailsFields } from './components/PrintTable/interfaces';
import dayjs from 'dayjs';
import usePrintTable from '@/src/hooks/usePrintTable/usePrintTable.hook';
import { type IPrintTableData } from '@/src/hooks/useMasterData/masterData.interface';
import { usePrintHandler } from '@/src/hooks/usePrintHandler/usePrintHandler.hook';
import PrintLayout from './components/PrintLayout/PrintLayout';

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrintSetupLists = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const printContentRef = useRef<HTMLDivElement>(null);
  const { handlePrint } = usePrintHandler(printContentRef as React.RefObject<HTMLDivElement>);

  const [selectedItems, setSelectedItems] = useState<IPrintTableData[] | []>([]);

  const [printTableQueryData, setPrintTableQueryData] = useState<PrintDetailsFields | null>(null);

  const printTableData = usePrintTable(
    printTableQueryData?.tourDate ?? '',
    printTableQueryData?.technicianEmployeeNumberType ?? '',
    printTableQueryData?.mA_NM,
    printTableQueryData?.branch
  );

  const onFilter = async (queryValues: PrintDetailsFields) => {
    const formattedDate: string = queryValues.tourDate
      ? dayjs(queryValues.tourDate).format('YYYY-MM-DD')
      : '';

    setPrintTableQueryData({
      tourDate: formattedDate,
      mA_NM: queryValues.mA_NM,
      technicianEmployeeNumberType: queryValues.technicianEmployeeNumberType,
      branch: queryValues.branch,
    });
  };

  const handleModalClose = () => {
    onClose(false);
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: handleModalClose,
          variant: 'outlined',
        },
        {
          label: t('PRINT_SELECTED_LISTS'),
          onClick: () => {
            if (selectedItems.length > 0) {
              handlePrint();
            } else {
              dispatch(showErrorMessage(t('PLEASE_SELECT_ROW_TO_PRINT')));
            }
          },
        },
      ]}
    />
  );

  useEffect(() => {
    if (printTableData.isError) {
      dispatch(showErrorMessage(t('DATA_FETCH_ERROR')));
    }
  }, [printTableData.isError]);

  return (
    <CustomModal
      open
      onClose={handleModalClose}
      title={t('PRINT_SETUP_LISTS')}
      actions={modalActions}
    >
      <PrintDetails onFilter={onFilter} />

      {printTableData.data && (
        <PrintTable
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          isLoading={printTableData.isLoading}
          printableData={printTableData.data}
        />
      )}
      <PrintLayout ref={printContentRef} selectedItems={selectedItems} />
    </CustomModal>
  );
};

export default PrintSetupLists;
