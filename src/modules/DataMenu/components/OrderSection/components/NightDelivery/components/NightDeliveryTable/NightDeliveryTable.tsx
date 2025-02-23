import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type NightDeliveryData } from '@/src/hooks/useGetPostOrderOrGoodsReceiptData/types';
import { formatCurrency } from '@/src/helpers/formatCurrency';
import Iconify from '@/src/components/iconify/iconify';

interface Props {
  data: TableData[];
  isLoading: boolean;
  onEsoClick: (row: NightDeliveryData) => void;
  onEditClick: (row: NightDeliveryData) => void;
}

const NightDeliveryTable = ({ data, isLoading, onEsoClick, onEditClick }: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'bestDat', label: t('BEST_DAT'), sortable: false },
    { id: 'bestNr', label: t('BEST_NR_S7000'), sortable: false },
    { id: 'soNr', label: t('SO_NR'), sortable: false },
    { id: 'tourAm', label: t('TOUR_AM'), sortable: false },
    { id: 'sWGA', label: t('S_WGA'), sortable: false },
    { id: 'herstNr', label: t('HERST_NR'), sortable: false },
    { id: 'manufacturer', label: t('MANUFACTURER'), sortable: false },
    { id: 'articleNo', label: t('ARTICLE_NO'), sortable: false },
    { id: 'productDescription', label: t('PRODUCT_DESCRIPTION'), sortable: false },
    { id: 'anzArrived', label: t('ANZ_ARRIVED'), sortable: false },
    { id: 'liefernr', label: t('LIEFERNR'), sortable: false },
    { id: 'anzOrdered', label: t('ANZ_ORDERED'), sortable: false },
    { id: 'anzBooked', label: t('ANZ_BOOKED'), sortable: false },
    { id: 'lp', label: t('LP'), sortable: false },
    { id: 'productID', label: t('PRODUCT_ID'), sortable: false },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    bestDat: true,
    bestNr: true,
    soNr: true,
    tourAm: true,
    sWGA: true,
    herstNr: true,
    manufacturer: true,
    articleNo: true,
    productDescription: true,
    anzArrived: true,
    liefernr: true,
    anzOrdered: true,
    anzBooked: false,
    lp: false,
    productID: false,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="NightDeliveryTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={-1} aria-label="night-delivery-table-row">
          {columnVisibility.bestDat && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(getDate(row.OrderedDate?.toString()))} />
            </TableCell>
          )}
          {columnVisibility.bestNr && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.SamOrderId)} />
            </TableCell>
          )}
          {columnVisibility.soNr && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.OrderId)} />
            </TableCell>
          )}
          {columnVisibility.tourAm && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(getDate(row.AppointmentDate?.toString()))} />
            </TableCell>
          )}
          {columnVisibility.sWGA && (
            <TableCell align="left">
              <Checkbox disabled checked={!!row.IsWga} />
            </TableCell>
          )}
          {columnVisibility.herstNr && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ManufacturerId)} />
            </TableCell>
          )}
          {columnVisibility.manufacturer && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ManufacturerName)} />
            </TableCell>
          )}
          {columnVisibility.articleNo && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ManufacturerArticleNumber)} />
            </TableCell>
          )}
          {columnVisibility.productDescription && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ProductDescription)} />
            </TableCell>
          )}
          {columnVisibility.anzArrived && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.DeliveredNumber)} />
            </TableCell>
          )}
          {columnVisibility.liefernr && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.DeliveryNumber)} />
            </TableCell>
          )}
          {columnVisibility.anzOrdered && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.OrderedQuantity)} />
            </TableCell>
          )}
          {columnVisibility.anzBooked && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ReceivedQuantity)} />
            </TableCell>
          )}
          {columnVisibility.lp && (
            <TableCell align="left">{formatCurrency(row.ListPriceExclTax as number)}</TableCell>
          )}
          {columnVisibility.productID && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.ProductId)} />
            </TableCell>
          )}

          <TableCell align="right">
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(e) => {
                handleMenuClick(e, index);
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl) && menuRowId === index}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { minWidth: '110px' } } }}
              onClose={handleMenuClose}
            >
              <MenuItem
                disableRipple
                sx={{ gap: 1.5 }}
                onClick={() => {
                  onEsoClick(row as unknown as NightDeliveryData);
                }}
              >
                <Iconify icon={'material-symbols:library-add'} />
                {t('ESO')}
              </MenuItem>
              <MenuItem
                disabled={row.OrderedQuantity < row.DeliveredNumber}
                onClick={() => {
                  onEditClick(row as unknown as NightDeliveryData);
                }}
                disableRipple
                sx={{ gap: 1.5 }}
              >
                <Iconify icon="material-symbols:edit" />
                {t('EDIT')}
              </MenuItem>
            </Menu>
          </TableCell>
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default NightDeliveryTable;
