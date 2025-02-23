import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { getDate } from '@/src/helpers/formatDate';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from '@/src/components/iconify/iconify';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { useSelector } from '@/src/redux/store';

interface Props {
  data: TableData[];
  isLoading: boolean;
  activeOrderDeviceRow: TableData | undefined;
  setActiveOrderDeviceRow: Dispatch<SetStateAction<TableData | undefined>>;
  onEditOrderDevice: (data: TableData) => void;
  onDeleteOrderDevice: (data: TableData) => void;
}

const OrderDevicesTable = ({
  data,
  isLoading,
  activeOrderDeviceRow,
  setActiveOrderDeviceRow,
  onEditOrderDevice,
  onDeleteOrderDevice,
}: Props) => {
  const { t } = useTranslation('index');
  const { palette } = useTheme();
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const headCells: HeadCell[] = [
    { id: 'manufacturerID', label: t('MANUFACTURE_ID'), sortable: false },
    { id: 'manufacture', label: t('MANUFACTURER'), sortable: false },
    { id: 'productGroupID', label: t('PRODUCT_GROUP_ID'), sortable: false },
    { id: 'productGroup', label: t('PRODUCT_GROUP'), sortable: false },
    { id: 'model', label: t('MODEL'), sortable: false },
    { id: 'serialNo', label: t('SERIAL_NO'), sortable: false },
    { id: 'productNo', label: t('PRODUCT_NO'), sortable: false },
    { id: 'installationDate', label: t('INSTALLATION_DATE'), sortable: false },
    { id: 'asamMeasurement', label: t('ASAM_MEASUREMENT'), sortable: false },
    { id: 'device', label: t('DEVICE'), sortable: false },
    { id: 'deviceOrderNo', label: t('PRODUCT_ID'), sortable: false },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    manufacturerID: false,
    manufacture: true,
    productGroupID: false,
    productGroup: true,
    model: true,
    serialNo: true,
    productNo: false,
    installationDate: true,
    asamMeasurement: true,
    device: true,
    deviceOrderNo: true,
    actionButton: true,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const handleActiveRow = (row: TableData) => {
    if (activeOrderDeviceRow?.UId !== row.UId) {
      setActiveOrderDeviceRow(row);
    } else {
      setActiveOrderDeviceRow(undefined);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, UId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(UId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  return (
    <CustomTable
      roundedHead={false}
      headCells={headCells}
      setTableData={setTableData}
      rows={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="OrderDevicesTable"
    >
      {tableData.map((row, index) => {
        return (
          <Fragment key={index}>
            <TableRow
              hover
              tabIndex={-1}
              onClick={() => {
                handleActiveRow(row);
              }}
              aria-label="order-device-row"
              sx={{
                cursor: 'pointer',
                backgroundColor:
                  activeOrderDeviceRow?.UId === row.UId ? palette.secondary.light : undefined,
              }}
            >
              {columnVisibility.manufacturerID && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.ManufacturerId ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.manufacture && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.Manufacturer ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.productGroupID && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.ProductGroupId ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.productGroup && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.ProductGroup ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.model && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.Model ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.serialNo && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.SerialNumber ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.productNo && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.ProductNumber ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.installationDate && (
                <TableCell align="left">
                  <OverflowTooltip
                    text={`${row.InstallationDate ? getDate(String(row.InstallationDate)) : '-'}`}
                  />
                </TableCell>
              )}
              {columnVisibility.asamMeasurement && (
                <TableCell align="left">
                  <OverflowTooltip text={sanitizeData(row.ASAMMeasurement)} />
                </TableCell>
              )}
              {columnVisibility.device && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.Device ?? '-'}`} />
                </TableCell>
              )}
              {columnVisibility.deviceOrderNo && (
                <TableCell align="left">
                  <OverflowTooltip text={`${row.ProductId ?? '-'}`} />
                </TableCell>
              )}
              <TableCell align="right">
                <IconButton
                  onClick={(e) => {
                    handleMenuClick(e, row.UId as string);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl) && menuRowId === row.UId}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{ paper: { sx: { minWidth: '110px' } } }}
                  aria-labelledby="actions-menu-for-table-row"
                >
                  <MenuItem
                    onClick={() => {
                      onEditOrderDevice(row);
                    }}
                    disableRipple
                    sx={{ gap: 1.5 }}
                    disabled={isSoReadOnly}
                  >
                    <Iconify icon="material-symbols:edit" />
                    {t('EDIT')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onDeleteOrderDevice(row);
                    }}
                    disableRipple
                    sx={{ gap: 1.5 }}
                    disabled={isSoReadOnly}
                  >
                    <Iconify icon="material-symbols:delete" />
                    {t('DELETE')}
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          </Fragment>
        );
      })}
    </CustomTable>
  );
};
export default OrderDevicesTable;
