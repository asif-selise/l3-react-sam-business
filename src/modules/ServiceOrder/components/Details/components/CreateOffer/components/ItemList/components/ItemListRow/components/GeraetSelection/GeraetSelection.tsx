import { Alert, Box, Checkbox, TableCell, TableRow } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import ItemListSelectionModal from '../ItemListSelectionModal/ItemListSelectionModal';
import { type GeraetItem } from '../../../../../../Interfaces/GeraetItem';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import { useTranslation } from 'react-i18next';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type KvNoGeraetNo } from '../../../../../../Interfaces/KvNoGeraetNo';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { formatCurrency } from '@/src/helpers/formatCurrency';

interface Props {
  openGeraetSelection: boolean;
  itemList: GeraetItem[];
  onClose: () => void;
  hasBinding: boolean;
  activeLoader: boolean;
  onSave: (updatedGeraetItems: GeraetItem[]) => void;
}

const GeraetSelection = ({
  openGeraetSelection,
  onClose,
  itemList,
  hasBinding,
  onSave,
  activeLoader,
}: Props) => {
  const { t } = useTranslation('index');

  const [geratList, setGeratList] = useState<KvNoGeraetNo[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    actionButton: true,
    manufacturerArticleNumber: true,
    color: true,
    ...(hasBinding ? { binding: true } : {}),
    listPriceExcl: true,
    description: true,
  });

  const headCells: HeadCell[] = [
    { id: 'actionButton', label: '', sortable: false, align: 'center' },
    { id: 'manufacturerArticleNumber', label: t('ARTICLE_NUMBER'), sortable: false },
    { id: 'color', label: t('COLOR'), sortable: false },
    ...(hasBinding ? [{ id: 'binding', label: t('BINDING'), sortable: false }] : []),
    { id: 'listPriceExcl', label: t('LIST_PRICE_EXCL'), sortable: false },
    { id: 'description', label: t('DESCRIPTION'), sortable: false },
  ];

  const handleCheckboxChange = (productId: number) => {
    setGeratList((prevList) =>
      prevList.map((item) => ({
        ...item,
        IsChecked: item.ProductId === productId ? !item.IsChecked : false,
      }))
    );
  };

  const handleItemSelectionSave = () => {
    const updatedItemList: GeraetItem[] = itemList.map((item: GeraetItem, index) => {
      return {
        ...item,
        Data: geratList[index],
      };
    });

    onSave(updatedItemList);
  };

  const extractDataObjects = (dataArray: GeraetItem[]) => {
    return dataArray.map((item: GeraetItem) => item.Data);
  };

  useEffect(() => {
    setGeratList(extractDataObjects(itemList));
  }, [itemList]);

  return (
    <ItemListSelectionModal
      isOpen={openGeraetSelection}
      onSave={handleItemSelectionSave}
      onClose={onClose}
    >
      <Alert severity="info" sx={{ pl: 2 }}>
        {t('SELECT_ONE_OR_MORE_ITEMS_BY_SELECTING_THE_RELEVANT_ROWS')}
      </Alert>
      <Box mt={'16px'}>
        <CustomTable
          roundedHead={true}
          headCells={headCells}
          setTableData={setTableData}
          rows={geratList as unknown as TableData[]}
          numberOfRowsPerPage={5}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          tableName="GeraetSelectionTable"
          isLoading={activeLoader}
        >
          {tableData.map((row) => {
            return (
              <Fragment key={row.ProductId as number}>
                <TableRow
                  hover
                  tabIndex={-1}
                  sx={{
                    background: row.IsChecked ? COMMON.grey[300] : '',
                  }}
                >
                  <TableCell align="left">
                    <Checkbox
                      checked={row.IsChecked as boolean}
                      onChange={() => {
                        handleCheckboxChange(row.ProductId as number);
                      }}
                    />
                  </TableCell>

                  {columnVisibility.manufacturerArticleNumber && (
                    <TableCell align="left"> {row.ArticleNumber}</TableCell>
                  )}

                  {columnVisibility.color && <TableCell align="left"> {row.Color}</TableCell>}

                  {columnVisibility.binding && hasBinding && (
                    <TableCell align="left"> {row.Binding}</TableCell>
                  )}

                  {columnVisibility.listPriceExcl && (
                    <TableCell align="left">{formatCurrency(row.PriceExclude as number)}</TableCell>
                  )}
                  {columnVisibility.description && (
                    <TableCell align="left">
                      <OverflowTooltip variant="body2" text={sanitizeData(row.Description)} />
                    </TableCell>
                  )}
                </TableRow>
              </Fragment>
            );
          })}
        </CustomTable>
      </Box>
    </ItemListSelectionModal>
  );
};

export default GeraetSelection;
