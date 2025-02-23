import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
} from 'react';
import CustomTableHead from './components/CustomTableHead/CustomTableHead';
import { type HeadCell, type Order, type TableData } from './types';
import {
  getComparator,
  getCustomTableSettings,
  stableSort,
  updateCustomTableSettings,
} from './utilities';
import { useTranslation } from 'react-i18next';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'; // Import your icon
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import Scrollbar from '../Scrollbar/Scrollbar';

interface TableProps {
  headCells: HeadCell[];
  roundedHead?: boolean;
  rows: TableData[];
  setTableData: Dispatch<SetStateAction<TableData[]>>;
  children: ReactNode;
  isLoading?: boolean;
  fullHeight?: boolean;
  numberOfRowsPerPage?: number;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;
  noPagination?: boolean;
  tableName: string;
  totalDataLength?: number;
  onPageChange?: (pageNumber: number) => void;
  serverPagination?: boolean;
}

const CustomTable = ({
  headCells,
  rows,
  setTableData,
  children,
  isLoading = false,
  fullHeight = false,
  roundedHead = true,
  numberOfRowsPerPage = 10,
  columnVisibility,
  setColumnVisibility,
  noPagination = false,
  tableName,
  totalDataLength,
  onPageChange,
  serverPagination = false,
}: TableProps) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(numberOfRowsPerPage);
  const { t } = useTranslation('index');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (onPageChange) onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (onPageChange) onPageChange(1);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(() => {
    if (noPagination || serverPagination) {
      return stableSort(rows, getComparator(order, orderBy));
    }

    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, rows, noPagination]);

  const toggleColumnSelection = () => {
    const newVisibility: Record<string, boolean> = {};
    headCells.forEach((column) => {
      newVisibility[column.id] = true;
    });
    setColumnVisibility(newVisibility);
  };

  useEffect(() => {
    if (isInitialized) return;

    const storedTableData = getCustomTableSettings(tableName);
    if (storedTableData) {
      setRowsPerPage(storedTableData?.rowsPerPage);
      setColumnVisibility(storedTableData?.columnVisibility);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    updateCustomTableSettings(tableName, { columnVisibility, rowsPerPage });
  }, [columnVisibility, rowsPerPage]);

  useEffect(() => {
    if (visibleRows) {
      setTableData(visibleRows);
    }
  }, [visibleRows]);

  useEffect(() => {
    if (!serverPagination) {
      setPage(0);
    }
  }, [rows]);

  return (
    <Paper
      sx={{
        p: 0,
        width: '100%',
        height: fullHeight ? '100%' : 'auto',
        mb: 2,
        borderRadius: `${roundedHead ? '16px' : '0px 0px 16px 16px'}`,
        boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
        overflow: 'hidden',
      }}
      aria-label="Custom Table"
    >
      <TableContainer>
        <Scrollbar>
          <Table aria-labelledby="tableTitle" size={'medium'}>
            <CustomTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells.filter((headCell) => columnVisibility[headCell.id])}
              columnVisibility={columnVisibility}
            />
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">
                  <Box
                    sx={{ height: '37px', width: '37px' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {rows.length > 0 ? (
                  children
                ) : (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      {t('NO_DATA_AVAILABLE')}
                    </TableCell>
                  </TableRow>
                )}
                {/* {emptyRows > 0 && ( */}
                {/*   <TableRow style={{ height: 53 * emptyRows }}> */}
                {/*     <TableCell colSpan={headCells.length} /> */}
                {/*   </TableRow> */}
                {/* )} */}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>
      <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} height={'64px'}>
        {!noPagination && (
          <>
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={totalDataLength ?? rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ height: '20px', mr: '8px', borderWidth: '1px' }}
            />
          </>
        )}
        <Box mr={'12px'}>
          <IconButton onClick={handleClick}>
            <SettingsOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem sx={{ background: COMMON.grey[100] }} onClick={toggleColumnSelection}>
              <Checkbox checked={Object.values(columnVisibility).every(Boolean)} />
              <Typography variant="subtitle2" color={'text.secondary'}>
                {t('SELECT_ALL')}
              </Typography>
            </MenuItem>
            {headCells.map(
              (column) =>
                column.id !== 'actionButton' && (
                  <MenuItem
                    key={column.id}
                    onClick={() => {
                      toggleColumnVisibility(column.id);
                    }}
                  >
                    <Checkbox checked={columnVisibility[column.id]} />
                    <Typography variant="body2">{column.label}</Typography>
                  </MenuItem>
                )
            )}
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomTable;
