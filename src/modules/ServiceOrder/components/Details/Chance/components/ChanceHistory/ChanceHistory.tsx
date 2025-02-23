import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { getDate } from '@/src/helpers/formatDate';
import { TableRow, TableCell } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TableData[];
  isLoading: boolean;
}

const ChanceHistory = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'Entrance', label: t('ENTRANCE'), sortable: false },
    { id: 'mustbeCompletedBy', label: t('MUST_BE_COMPLETED_BY'), sortable: false },
    { id: 'mailReceivedOn', label: t('MAIL_RECEIVED_ON'), sortable: false },
    { id: 'remarks', label: t('REMARKS'), sortable: false },
    { id: 'letter', label: t('LETTER'), sortable: false },
    { id: 'completed', label: t('COMPLETED'), sortable: false },
    { id: 'ChangedBy', label: t('CHANGED_BY'), sortable: false },
    { id: 'ChangedOn', label: t('CHANGED_ON'), sortable: false },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Entrance: true,
    mustbeCompletedBy: true,
    mailReceivedOn: true,
    remarks: true,
    letter: true,
    completed: true,
    ChangedBy: false,
    ChangedOn: false,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="ChanceHistory"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={-1} aria-label="chance-history-row">
          {columnVisibility.Entrance && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.EntryDateTime ? getDate(String(row.EntryDateTime)) : '-'}`}
              />
            </TableCell>
          )}
          {columnVisibility.mustbeCompletedBy && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.MustBeCompletedByDateTime ? getDate(String(row.MustBeCompletedByDateTime)) : '-'}`}
              />
            </TableCell>
          )}
          {columnVisibility.mailReceivedOn && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.MailReceivedOnDateTime ? getDate(String(row.MailReceivedOnDateTime)) : '-'}`}
              />
            </TableCell>
          )}
          {columnVisibility.remarks && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Remark ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.letter && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.AvailableLetter ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.completed && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.CompletedOnDateTime ? getDate(String(row.CompletedOnDateTime)) : '-'}`}
              />
            </TableCell>
          )}
          {columnVisibility.ChangedBy && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.ChangedByUser ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.ChangedOn && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.ChangedDateTime ? getDate(String(row.ChangedDateTime)) : '-'}`}
              />
            </TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default ChanceHistory;
