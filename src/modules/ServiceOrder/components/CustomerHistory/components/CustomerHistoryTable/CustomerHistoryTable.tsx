import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { formatCurrency } from '@/src/helpers/formatCurrency';
import { getDate } from '@/src/helpers/formatDate';
import { TableRow, TableCell } from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TableData[];
  isLoading: boolean;
}

const CustomerHistoryTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'soNr', label: t('SO_NR'), sortable: false },
    { id: 'kdNr', label: t('KD_NR'), sortable: false },
    { id: 'createdAt', label: t('CREATED_AT'), sortable: false },
    { id: 'documentDate', label: t('DOCUMENT_DATE'), sortable: false },
    { id: 'phoneNo', label: t('PHONE_NO'), sortable: false },
    { id: 'nameServiceLocation', label: t('NAME_SERVICE_LOCATION'), sortable: false },
    { id: 'manufacturer', label: t('MANUFACTURER'), sortable: false },
    { id: 'pg', label: t('PG'), sortable: false },
    { id: 'model', label: t('MODEL'), sortable: false },
    { id: 'serialNumber', label: t('SERIAL_NUMBER'), sortable: false },
    { id: 'productNo', label: t('PRODUCT_NO'), sortable: false },
    { id: 'color', label: t('COLOR'), sortable: false },
    { id: 'brand', label: t('BRAND'), sortable: false },
    { id: 'commissioningName', label: t('COMMISSIONING_NAME'), sortable: false },
    { id: 'lastSt', label: t('LAST_ST'), sortable: false },
    { id: 'lastStDate', label: t('LAST_ST_DATE'), sortable: false },
    { id: 'faultReport', label: t('FAULT_REPORT'), sortable: false },
    { id: 'revenue', label: t('REVENUE'), sortable: false },
    { id: 'status', label: t('STATUS'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    soNr: true,
    kdNr: true,
    createdAt: false,
    documentDate: false,
    phoneNo: true,
    nameServiceLocation: true,
    manufacturer: true,
    pg: false,
    model: true,
    serialNumber: true,
    productNo: false,
    color: false,
    brand: true,
    commissioningName: true,
    lastSt: false,
    lastStDate: false,
    faultReport: true,
    revenue: true,
    status: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={headCells}
        setTableData={setTableData}
        rows={data}
        isLoading={isLoading}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="CustomerHistoryTable"
      >
        {tableData.map((row, index) => {
          return (
            <Fragment key={index}>
              <TableRow hover tabIndex={-1} aria-label="customer-history-row">
                {columnVisibility.soNr && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.OrderId ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.kdNr && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.ManagementId ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.createdAt && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={`${row.CreatedAt ? getDate(String(row.CreatedAt)) : '-'}`}
                    />
                  </TableCell>
                )}
                {columnVisibility.documentDate && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={`${row.DocumentDate ? getDate(String(row.DocumentDate)) : '-'}`}
                    />
                  </TableCell>
                )}
                {columnVisibility.phoneNo && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.CustomerPhone ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.nameServiceLocation && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.CustomerAddress ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.manufacturer && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.Manufacturer ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.pg && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.ProductGroup ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.model && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.DeviceModel ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.serialNumber && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.SerialNumber ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.productNo && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.ProductNo ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.color && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.ProductColor ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.brand && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.Brand ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.commissioningName && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.OperatingStartDate ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.lastSt && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.LastST ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.lastStDate && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={`${row.AppointmentDate ? getDate(String(row.AppointmentDate)) : '-'}`}
                    />
                  </TableCell>
                )}
                {columnVisibility.faultReport && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.FaultReport ?? '-'}`} />
                  </TableCell>
                )}
                {columnVisibility.revenue && (
                  <TableCell align="left">{formatCurrency(row.Revenue as number)}</TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell align="left">
                    <OverflowTooltip text={`${row.Status ?? '-'}`} />
                  </TableCell>
                )}
              </TableRow>
            </Fragment>
          );
        })}
      </CustomTable>
    </>
  );
};

export default CustomerHistoryTable;
