import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { TableCell, TableRow } from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TableData[];
  isLoading: boolean;
  onSORepTableRowClick: (value: TableData) => void;
}

const SORepTable = ({ data, isLoading, onSORepTableRowClick }: Props) => {
  const { t } = useTranslation('index');
  const tableHeaders: HeadCell[] = [
    {
      id: 'offer',
      label: t('OFFER'),
      sortable: false,
    },
    {
      id: 'errorReportOffer',
      label: t('ERROR_REPORT_OFFER'),
      sortable: true,
    },
    {
      id: 'manufacturer',
      label: t('MANUFACTURER'),
      sortable: false,
    },
    {
      id: 'productGroup',
      label: t('PRODUCT_GROUP'),
      sortable: false,
    },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    offer: true,
    errorReportOffer: true,
    manufacturer: true,
    productGroup: false,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomTable
      roundedHead={false}
      headCells={tableHeaders}
      isLoading={isLoading}
      setTableData={setTableData}
      rows={data}
      numberOfRowsPerPage={5}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="SORepTable"
    >
      {!isLoading && !!data.length && (
        <>
          {tableData.map((row) => {
            return (
              <Fragment key={row.id as number}>
                <TableRow
                  hover
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                  onClick={async () => {
                    onSORepTableRowClick(row);
                  }}
                >
                  {columnVisibility.offer && (
                    <TableCell align="left"> {sanitizeData(`${row.SpecialOffer}`)}</TableCell>
                  )}
                  {columnVisibility.errorReportOffer && (
                    <TableCell align="left">{sanitizeData(`${row.ErrorReportOffer}`)}</TableCell>
                  )}
                  {columnVisibility.manufacturer && (
                    <TableCell align="left">{sanitizeData(`${row.ManufacturerId}`)}</TableCell>
                  )}
                  {columnVisibility.productGroup && (
                    <TableCell align="left">{sanitizeData(`${row.ProductGroupId}`)}</TableCell>
                  )}
                </TableRow>
              </Fragment>
            );
          })}
        </>
      )}
    </CustomTable>
  );
};
export default SORepTable;
