import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type QrFilterParams } from '@/src/hooks/useQrCodeSearch/types';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { getDate } from '@/src/helpers/formatDate';

interface Props {
  online: boolean;
  data: TableData[];
  isLoading: boolean;
  qrFilters: QrFilterParams;
}

const QRCodeHistory = ({ online, data, isLoading, qrFilters }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'QrCode', label: t('QR_CODE'), sortable: false },
    { id: 'SerialNumber', label: t('SN'), sortable: false },
    { id: 'ProductNumber', label: t('PNR'), sortable: false },
    { id: 'ManufacturerNumber', label: t('MANUFACTURE'), sortable: false },
    { id: 'ProductGroupNumber', label: t('PG_NR'), sortable: false },
    { id: 'Manufacturer', label: t('MANUFACTURER'), sortable: false },
    { id: 'ProductGroup', label: t('PG'), sortable: false },
    { id: 'Model', label: t('MODEL'), sortable: false },
    { id: 'Color', label: t('COLOR'), sortable: false },
    { id: 'Binding', label: t('BANDUNG'), sortable: false },
    { id: 'LastTenant', label: t('LAST_TENANT'), sortable: false },
    { id: 'CustomerStreet', label: t('STREET'), sortable: false },
    { id: 'CustomerStreetNumber', label: t('STR_I'), sortable: false },
    { id: 'CustomerCity', label: t('LOCATION'), sortable: false },
    {
      id: 'AdministrationApartmentNumber',
      label: t('APARTMENT_NO_ADMINISTRATION'),
      sortable: false,
    },
    { id: 'OwnerApartmentNumber', label: t('APARTMENT_NO_OWNER'), sortable: false },
    { id: 'AdministrationFloor', label: t('FLOOR_ADMINISTRATION'), sortable: false },
    {
      id: 'AdministrationApartmentDetails',
      label: t('APARTMENT_DETAILS_ADMINISTRATION'),
      sortable: false,
    },
    { id: 'ApartmentRemarks', label: t('APARTMENT_REMARKS'), sortable: false },
    { id: 'InstallationDate', label: t('INSTALLATION_DATE'), sortable: false },
    { id: 'ObjectID', label: t('OBJECT_ID'), sortable: false },
    { id: 'ApartmentID', label: t('APARTMENT_ID'), sortable: false },
    { id: 'ProductID', label: t('P_ID'), sortable: false },
    { id: 'AdministrationAddress', label: t('ADMINISTRATION'), sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    QrCode: true,
    SerialNumber: true,
    ProductNumber: false,
    ManufacturerNumber: true,
    ProductGroupNumber: true,
    Manufacturer: true,
    ProductGroup: false,
    Model: false,
    Color: false,
    Binding: false,
    LastTenant: false,
    CustomerStreet: false,
    CustomerStreetNumber: false,
    CustomerCity: false,
    AdministrationApartmentNumber: false,
    OwnerApartmentNumber: false,
    AdministrationFloor: false,
    AdministrationApartmentDetails: false,
    ApartmentRemarks: false,
    InstallationDate: false,
    ObjectID: false,
    ApartmentID: false,
    ProductID: false,
    AdministrationAddress: false,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  const filteredData = useMemo(() => {
    if (!qrFilters.SerialNumber) return [];

    if (online) return data;

    // offline filtering
    if (qrFilters.IsInactive) return [];

    const requestedNumberOfData = data.slice(0, qrFilters.TopRecordNumber ?? data.length);

    return requestedNumberOfData.filter((row) => {
      const isSearchFilterMatch = [
        row.AdministrationFloor,
        row.ManufacturerNumber,
        row.ProductGroupNumber,
        row.CustomerStreet,
        row.CustomerStreetNumber,
        row.CustomerCity,
        row.AdministrationApartmentNumber,
        row.OwnerApartmentNumber,
        row.AdministrationApartmentDetails,
        row.LastTenant,
        row.Manufacturer,
        row.ProductGroup,
        row.Model,
        row.PreferredBinding,
        row.Color,
        row.ProductNumber,
      ].some((field) =>
        field
          ?.toString()
          .toLowerCase()
          .includes(qrFilters.Filter?.toLowerCase() ?? '')
      );

      const isObjectIdMatch = row.ObjectID?.toString().includes(
        qrFilters.ObjectId?.toString() ?? ''
      );

      const isApartmentIdMatch = row.ApartmentID?.toString().includes(
        qrFilters.ApartmentId?.toString() ?? ''
      );

      const isSerialNumberMatch = row.SerialNumber?.toString().includes(
        qrFilters.SerialNumber ?? ''
      );

      return isSearchFilterMatch && isObjectIdMatch && isApartmentIdMatch && isSerialNumberMatch;
    });
  }, [online, data, qrFilters]);

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={headCells}
        setTableData={setTableData}
        rows={filteredData}
        isLoading={isLoading}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="QRCodeHistory"
      >
        {!isLoading && data.length > 0 && (
          <>
            {tableData.map((row, index) => {
              return (
                <TableRow key={index} hover tabIndex={-1} aria-label="qr-code-history-row">
                  {columnVisibility.QrCode && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.QrCode)} />
                    </TableCell>
                  )}
                  {columnVisibility.SerialNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.SerialNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.ProductNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ProductNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.ManufacturerNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ManufacturerNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.ProductGroupNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ProductGroupNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.Manufacturer && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.Manufacturer)} />
                    </TableCell>
                  )}
                  {columnVisibility.ProductGroup && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ProductGroup)} />
                    </TableCell>
                  )}
                  {columnVisibility.Model && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.Model)} />
                    </TableCell>
                  )}
                  {columnVisibility.Color && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.Color)} />
                    </TableCell>
                  )}
                  {columnVisibility.Binding && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.Binding)} />
                    </TableCell>
                  )}
                  {columnVisibility.LastTenant && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.LastTenant)} />
                    </TableCell>
                  )}
                  {columnVisibility.CustomerStreet && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.CustomerStreet)} />
                    </TableCell>
                  )}
                  {columnVisibility.CustomerStreetNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.CustomerStreetNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.CustomerCity && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.CustomerCity)} />
                    </TableCell>
                  )}
                  {columnVisibility.AdministrationApartmentNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.AdministrationApartmentNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.OwnerApartmentNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.OwnerApartmentNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.AdministrationFloor && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.AdministrationFloor)} />
                    </TableCell>
                  )}
                  {columnVisibility.AdministrationApartmentDetails && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.AdministrationApartmentDetails)} />
                    </TableCell>
                  )}
                  {columnVisibility.ApartmentRemarks && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ApartmentRemarks)} />
                    </TableCell>
                  )}
                  {columnVisibility.InstallationDate && (
                    <TableCell align="left">
                      <OverflowTooltip
                        text={sanitizeData(getDate(row.InstallationDate?.toString()))}
                      />
                    </TableCell>
                  )}
                  {columnVisibility.ObjectID && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ObjectID)} />
                    </TableCell>
                  )}
                  {columnVisibility.ApartmentID && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ApartmentID)} />
                    </TableCell>
                  )}
                  {columnVisibility.ProductID && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ProductID)} />
                    </TableCell>
                  )}
                  {columnVisibility.AdministrationAddress && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.AdministrationAddress)} />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </>
        )}
      </CustomTable>
    </>
  );
};

export default QRCodeHistory;
