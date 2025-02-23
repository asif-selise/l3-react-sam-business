import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import Iconify from '@/src/components/iconify/iconify';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableRow, TableCell, IconButton, Menu, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { type SamKvDetail } from '@/src/hooks/useTourData/tourData.interface';
import { formatCurrency } from '@/src/helpers/formatCurrency';

interface Props {
  data: TableData[];
  isLoading: boolean;
  onReplaceMaterial: (row: TableData) => void;
  onEdit: (row: TableData) => void;
  onDelete: (row: SamKvDetail) => void;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}

const MaterialTable = ({
  data,
  isLoading,
  onReplaceMaterial,
  onEdit,
  onDelete,
  readOnly,
  setReadOnly,
}: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'ProductID', label: t('PRODUCT_ID'), sortable: false },
    { id: 'Anz', label: t('QUANTITY'), sortable: false },
    { id: 'ArticleNo', label: t('ARTICLE_NO'), sortable: false },
    { id: 'Designation', label: t('DESIGNATION'), sortable: false },
    { id: 'KVOperation', label: t('KV_OPERATION'), sortable: false },
    { id: 'KVLifespan', label: t('KV_LIFESPAN'), sortable: false },
    { id: 'CreatedOn', label: t('CREATED_ON'), sortable: false },
    { id: 'ChangedOn', label: t('CHANGED_ON'), sortable: false },
    { id: 'ChangedBy', label: t('CHANGED_BY'), sortable: false },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    ProductID: true,
    Anz: true,
    ArticleNo: true,
    Designation: true,
    KVOperation: true,
    KVLifespan: true,
    CreatedOn: false,
    ChangedOn: false,
    ChangedBy: false,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

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
      tableName="MaterialTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={-1} aria-label="material-row">
          {columnVisibility.ProductID && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.ProductId ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.Anz && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Quantity ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.ArticleNo && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.ArticleNumber ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.Designation && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.Description ?? '-'}`} />
            </TableCell>
          )}
          {columnVisibility.KVOperation && (
            <TableCell align="left">{formatCurrency(row.UnitPrice as number)}</TableCell>
          )}
          {columnVisibility.KVLifespan && (
            <TableCell align="left">{formatCurrency(row.TotalCost as number)}</TableCell>
          )}
          {columnVisibility.CreatedOn && (
            <TableCell align="left">
              <OverflowTooltip text={`${dayjs(row.CreatedAt as string).format('DD.MM.YYYY')}`} />
            </TableCell>
          )}
          {columnVisibility.ChangedOn && (
            <TableCell align="left">
              <OverflowTooltip text={`${dayjs(row.UpdatedAt as string).format('DD.MM.YYYY')}`} />
            </TableCell>
          )}
          {columnVisibility.ChangedBy && (
            <TableCell align="left">
              <OverflowTooltip text={`${row.ChangedBy ?? '-'}`} />
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
                disabled={readOnly}
                onClick={() => {
                  onReplaceMaterial(row);
                }}
                disableRipple
                sx={{ gap: 1.5 }}
              >
                <Iconify icon="ant-design:product-filled" />
                {t('REPLACE_MATERIAL')}
              </MenuItem>
              <MenuItem
                disabled={readOnly}
                onClick={() => {
                  onEdit(row);
                }}
                disableRipple
                sx={{ gap: 1.5 }}
              >
                <Iconify icon="material-symbols:edit" />
                {t('EDIT')}
              </MenuItem>
              <MenuItem
                disabled={readOnly}
                onClick={() => {
                  onDelete(row as unknown as SamKvDetail);
                }}
                disableRipple
                sx={{ gap: 1.5 }}
              >
                <Iconify icon="material-symbols:delete" />
                {t('DELETE')}
              </MenuItem>
            </Menu>
          </TableCell>
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default MaterialTable;
