import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeData } from '@/src/helpers/sanitizeData';

interface Props {
  data: TableData[];
  isLoading: boolean;
}

const TourSheetAndArpListTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'day', label: t('DAY'), sortable: false },
    { id: 'date', label: t('DATE'), sortable: false },
    { id: 'status', label: t('STATUS'), sortable: false },
    { id: 'text', label: t('TEXT'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    day: true,
    date: true,
    status: true,
    text: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  const getTextArray = (text: string) => {
    const regex = /\[\d{2}:\d{2}\] [^\r\n]+/g;

    const result = text.match(regex);
    return result;
  };

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="TourSheetAndArpListTable"
    >
      {tableData.map((row, index) => (
        <TableRow
          key={index}
          hover
          aria-label="tour-sheet-and-arp-list-table-table-row"
          sx={{
            height: '20px',
          }}
        >
          {columnVisibility.day && <TableCell align="left">{sanitizeData(row.Day)}</TableCell>}
          {columnVisibility.date && <TableCell align="left">{sanitizeData(row.Date)}</TableCell>}
          {columnVisibility.status && (
            <TableCell align="left">{sanitizeData(row.Status)}</TableCell>
          )}
          {columnVisibility.text && (
            <TableCell align="left">
              {row.Text ? (
                <ul>
                  {getTextArray(row.Text?.toString())?.map((item, index) => (
                    <li key={index} style={{ marginTop: index !== 0 ? 1 : 0 }}>
                      <OverflowTooltip text={sanitizeData(item)} />
                    </li>
                  ))}
                </ul>
              ) : (
                '-'
              )}
            </TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default TourSheetAndArpListTable;
