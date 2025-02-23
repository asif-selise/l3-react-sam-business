import React, { useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import { TableCell, TableRow } from '@mui/material';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { type Article } from '../../Interfaces/Article';

interface Props {
  onClose: () => void;
  hideBackdrop?: boolean;
  data: Article[];
}

const OfferArticleList = ({ onClose, hideBackdrop = false, data }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'Quantity', label: t('QUANTITY'), sortable: false },
    { id: 'ArticleNumber', label: t('ARTICLE_NO'), sortable: false },
    { id: 'Description', label: t('DESCRIPTION'), sortable: false },
    { id: 'PriceExcl', label: t('PRICE_EXCL'), sortable: false },
    { id: 'TotalPrice', label: t('TOTAL_PRICE'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Quantity: true,
    ArticleNumber: true,
    Description: true,
    PriceExcl: true,
    TotalPrice: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomModal
      open
      title={t('OFFER_ARTICLE_LIST')}
      onClose={onClose}
      actions={
        <CustomModalActions
          actions={[{ label: t('DISCARD'), onClick: onClose, variant: 'outlined' }]}
        />
      }
      hideBackdrop={hideBackdrop}
    >
      <CustomTable
        headCells={headCells}
        setTableData={setTableData}
        rows={data as unknown as TableData[]}
        isLoading={false}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="OfferArticleListTable"
      >
        {tableData.map((row, index) => (
          <TableRow key={index} hover tabIndex={-1} aria-label="material-row">
            {columnVisibility.Quantity && (
              <TableCell align="left">
                <OverflowTooltip text={`${row.Quantity ?? '-'}`} />
              </TableCell>
            )}
            {columnVisibility.ArticleNumber && (
              <TableCell align="left">
                <OverflowTooltip text={`${row.ArticleNumber ?? '-'}`} />
              </TableCell>
            )}
            {columnVisibility.Description && (
              <TableCell align="left">
                <OverflowTooltip text={`${row.Description ?? '-'}`} />
              </TableCell>
            )}
            {columnVisibility.PriceExcl && (
              <TableCell align="left">
                <OverflowTooltip text={`${row.PriceExcl ?? '-'}`} />
              </TableCell>
            )}
            {columnVisibility.TotalPrice && (
              <TableCell align="left">
                <OverflowTooltip text={`${row.TotalPrice ?? '-'}`} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </CustomTable>
    </CustomModal>
  );
};

export default OfferArticleList;
