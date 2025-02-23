import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { useSelector } from '@/src/redux/store';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TableData[];
  onUpdatedChecklistRow: (row: TableData) => void;
}

const ChecklistTable = ({ data, onUpdatedChecklistRow }: Props) => {
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const headCells: HeadCell[] = [
    { id: 'pg', label: t('PG'), sortable: true },
    { id: 'checkQuestion', label: t('CHECK_QUESTION'), sortable: false },
    { id: 'answer', label: t('ANSWER'), sortable: false },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    pg: true,
    checkQuestion: true,
    answer: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      noPagination
      tableName="ChecklistTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={-1} aria-label="checklist-row">
          {columnVisibility.pg && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.ProductGroupNumber ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.checkQuestion && (
            <TableCell align="left" sx={{ width: '87%' }}>
              <OverflowTooltip text={`${row.Question ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.answer && (
            <TableCell align="left">
              <Checkbox
                color="default"
                disabled={isSoReadOnly}
                checked={!!row.Answer}
                indeterminate={row.Answer === null}
                onClick={() => {
                  onUpdatedChecklistRow(row);
                }}
              />
            </TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default ChecklistTable;
