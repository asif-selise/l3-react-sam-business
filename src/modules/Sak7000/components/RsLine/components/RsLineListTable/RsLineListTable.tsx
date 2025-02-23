import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { getDate } from '@/src/helpers/formatDate';
import { type ISakRsLineDataResponse } from '@/src/hooks/useSakRslineData/types';

interface Props {
  data: ISakRsLineDataResponse[];
  isLoading: boolean;
}

const RsLineListTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'OrderNo', label: t('ORDER_NO'), sortable: false },
    { id: 'ManufacturerNo', label: t('MANUFACTURER_NO'), sortable: false },
    { id: 'ProductGroupNo', label: t('PRODUCT_GROUP_NO'), sortable: false },
    { id: 'Challenge', label: t('CHALLENGE'), sortable: false },
    { id: 'Remarks', label: t('REMARKS'), sortable: false },
    { id: 'DoneBy', label: t('DONE_BY'), sortable: false },
    { id: 'DoneOn', label: t('DONE_ON'), sortable: false },
    { id: 'Author', label: t('AUTHOR'), sortable: false },
    { id: 'RecordedBy', label: t('RECORDED_BY'), sortable: false },
    { id: 'RecordedOn', label: t('RECORDED_ON'), sortable: false },
    { id: 'RslineId', label: t('RSLINE_ID'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    OrderNo: true,
    ManufacturerNo: true,
    ProductGroupNo: true,
    Challenge: true,
    Remarks: true,
    DoneBy: true,
    DoneOn: true,
    Author: true,
    RecordedBy: true,
    RecordedOn: true,
    RslineId: true,
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
      tableName="RsLineListTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={0} aria-label="rs-line-list-table-row">
          {columnVisibility.OrderNo && (
            <TableCell align="left">{sanitizeData(row.OrderNo)}</TableCell>
          )}
          {columnVisibility.ManufacturerNo && (
            <TableCell align="left">{sanitizeData(row.ManufacturerNo)}</TableCell>
          )}
          {columnVisibility.ProductGroupNo && (
            <TableCell align="left">{sanitizeData(row.ProductGroupNo)}</TableCell>
          )}
          {columnVisibility.Challenge && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.Challenge)} />
            </TableCell>
          )}
          {columnVisibility.Remarks && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.Remarks)} />
            </TableCell>
          )}
          {columnVisibility.DoneBy && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.DoneBy)} />
            </TableCell>
          )}
          {columnVisibility.DoneOn && (
            <TableCell align="left">{sanitizeData(getDate(row.DoneOn.toString()))}</TableCell>
          )}
          {columnVisibility.Author && (
            <TableCell align="left">{sanitizeData(row.Author)}</TableCell>
          )}
          {columnVisibility.RecordedBy && (
            <TableCell align="left">{sanitizeData(row.RecordedBy)}</TableCell>
          )}
          {columnVisibility.RecordedOn && (
            <TableCell align="left">{sanitizeData(getDate(row.RecordedOn.toString()))}</TableCell>
          )}
          {columnVisibility.RslineId && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.RslineId}`} />
            </TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default RsLineListTable;
