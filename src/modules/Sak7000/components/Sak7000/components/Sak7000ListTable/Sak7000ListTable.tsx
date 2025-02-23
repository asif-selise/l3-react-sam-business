import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type ISak7000DataResponse } from '@/src/hooks/useSak7000Data/types';

interface Props {
  data: ISak7000DataResponse[];
  isLoading: boolean;
}

const Sak7000ListTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'Source', label: t('SOURCE'), sortable: false },
    { id: 'Quality', label: t('QUALITY'), sortable: false },
    { id: 'Id', label: t('ID'), sortable: false },
    { id: 'Text1', label: t('TEXT_1'), sortable: false },
    { id: 'Text2', label: t('TEXT_2'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Source: true,
    Quality: true,
    Id: true,
    Text1: true,
    Text2: true,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data as unknown as TableData[]}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="Sak7000ListTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={0} aria-label="sak-7000-list-table-row">
          {columnVisibility.Source && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Source}`} />
            </TableCell>
          )}
          {columnVisibility.Quality && (
            <TableCell align="left">{sanitizeData(row.Quality)}</TableCell>
          )}
          {columnVisibility.Id && <TableCell align="left">{sanitizeData(row.Id)}</TableCell>}
          {columnVisibility.Text1 && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Text1}`} />
            </TableCell>
          )}
          {columnVisibility.Text2 && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Text2}`} />
            </TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default Sak7000ListTable;
