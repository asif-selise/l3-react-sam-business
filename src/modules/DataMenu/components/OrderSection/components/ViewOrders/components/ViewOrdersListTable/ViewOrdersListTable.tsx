import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { formatCurrency } from '@/src/helpers/formatCurrency';

interface Props {
  data: TableData[];
  isLoading: boolean;
}

const ViewOrdersListTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'IsNightOrder', label: t('NIGHT_DELIVERY'), sortable: false },
    { id: 'OrderedDate', label: t('ORDER_DATE'), sortable: false },
    { id: 'SamOrderId', label: t('ORDER_NUMBER'), sortable: false },
    { id: 'OrderId', label: t('SO_NUMBER'), sortable: false },
    { id: 'AppointmentDate', label: t('APPOINTMENT_DATE'), sortable: false },
    { id: 'ManufacturerId', label: t('MANUFACTURER_NUMBER'), sortable: false },
    { id: 'ManufacturerName', label: t('MANUFACTURER'), sortable: false },
    { id: 'ManufacturerArticleNumber', label: t('ARTICLE_NUMBER'), sortable: false },
    { id: 'ProductDescription', label: t('ARTICLE_DESCRIPTION'), sortable: false },
    { id: 'DeliveryNumber', label: t('DELIVERY_NUMBER'), sortable: false },
    { id: 'OrderedQuantity', label: t('QUANTITY_ORDERED'), sortable: false },
    { id: 'ReceivedQuantity', label: t('QUANTITY_BOOKED'), sortable: false },
    { id: 'ListPriceExclTax', label: t('LP'), sortable: false },
    { id: 'ProductId', label: t('PROD_ID'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    IsNightOrder: true,
    OrderedDate: true,
    SamOrderId: true,
    OrderId: true,
    AppointmentDate: true,
    ManufacturerId: true,
    ManufacturerName: true,
    ManufacturerArticleNumber: true,
    ProductDescription: true,
    DeliveryNumber: true,
    OrderedQuantity: true,
    ReceivedQuantity: true,
    ListPriceExclTax: true,
    ProductId: true,
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
      tableName="ViewOrdersListTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={0} aria-label="view-orders-table-row">
          {columnVisibility.IsNightOrder && (
            <TableCell align="left">
              <Checkbox disabled checked={!!row.IsNightOrder} />
            </TableCell>
          )}
          {columnVisibility.OrderedDate && (
            <TableCell align="left">
              <OverflowTooltip
                text={`${row.OrderedDate ? getDate(row.OrderedDate.toString()) : '-'}`}
              />
            </TableCell>
          )}
          {columnVisibility.SamOrderId && (
            <TableCell align="left">{sanitizeData(row.SamOrderId)}</TableCell>
          )}
          {columnVisibility.OrderId && (
            <TableCell align="left">{sanitizeData(row.OrderId)}</TableCell>
          )}
          {columnVisibility.AppointmentDate && (
            <TableCell align="left">
              {`${row.AppointmentDate ? getDate(row.AppointmentDate.toString()) : '-'}`}
            </TableCell>
          )}
          {columnVisibility.ManufacturerId && (
            <TableCell align="left">{sanitizeData(row.ManufacturerId)}</TableCell>
          )}
          {columnVisibility.ManufacturerName && (
            <TableCell align="left">{sanitizeData(row.ManufacturerName)}</TableCell>
          )}
          {columnVisibility.ManufacturerArticleNumber && (
            <TableCell align="left">{sanitizeData(row.ManufacturerArticleNumber)}</TableCell>
          )}
          {columnVisibility.ProductDescription && (
            <TableCell align="left">
              <OverflowTooltip text={`${sanitizeData(row.ProductDescription)}`} />
            </TableCell>
          )}
          {columnVisibility.DeliveryNumber && (
            <TableCell align="left">{sanitizeData(row.DeliveryNumber)}</TableCell>
          )}
          {columnVisibility.OrderedQuantity && (
            <TableCell align="left">{sanitizeData(row.OrderedQuantity)}</TableCell>
          )}
          {columnVisibility.ReceivedQuantity && (
            <TableCell align="left">{sanitizeData(row.ReceivedQuantity)}</TableCell>
          )}
          {columnVisibility.ListPriceExclTax && (
            <TableCell align="left">{formatCurrency(row.ListPriceExclTax as number)}</TableCell>
          )}
          {columnVisibility.ProductId && (
            <TableCell align="left">{sanitizeData(row.ProductId)}</TableCell>
          )}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default ViewOrdersListTable;
