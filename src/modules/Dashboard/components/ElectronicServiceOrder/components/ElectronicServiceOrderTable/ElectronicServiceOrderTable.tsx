import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { Box, IconButton, Menu, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { Fragment, useMemo, useState } from 'react';
import { formatDateTime, getDateTime } from '@/src/helpers/formatDate';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from '@/src/components/iconify/iconify';
import EditESO from '../EditESO/EditESO';
import { SPEACIAL_FILTER, type ESOFilterFields, type EditESOFields } from '../../types';
import { sanitizeData } from '@/src/helpers/sanitizeData';

interface Props {
  systemUser: string;
  data: TableData[];
  esoFilters: ESOFilterFields;
  onEditModalSubmit: (formData: EditESOFields) => void;
}

const ElectronicServiceOrderTable = ({
  systemUser,
  data,
  esoFilters,
  onEditModalSubmit,
}: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'ItemType', label: 'ESO', sortable: true },
    { id: 'OrderId', label: 'SO-NR', sortable: true },
    { id: 'AdministratorId', label: t('VERW'), sortable: true },
    { id: 'StatusText', label: t('STATUS'), sortable: false, align: 'center' },
    { id: 'ScheduledDate', label: t('DISPATCH'), sortable: false },
    { id: 'ProductGroupNumber', label: t('CUSTOMER_INFORMATION'), sortable: true },
    { id: 'WorkflowRemark', label: t('REMARKS'), sortable: true },
    { id: 'Creator', label: t('CREATED_BY'), sortable: true },
    { id: 'CreatedAt', label: t('CREATED_AT'), sortable: true },
    { id: 'ProcessedBy', label: t('PROCESSOR'), sortable: true },
    { id: 'ProcessingTime', label: t('PROCESSED_AT'), sortable: true },
    { id: 'LastChangedBy', label: t('LAST_CHANGED_BY'), sortable: true },
    { id: 'LastUpdatedAt', label: t('LAST_CHANGED_AT'), sortable: true },
    { id: 'ErledigtVon', label: t('DONE_BY'), sortable: true },
    { id: 'ErledigtAm', label: t('DONE_AT'), sortable: true },
    { id: 'WorkflowId', label: 'ESO ID', sortable: true },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    ItemType: true,
    OrderId: true,
    AdministratorId: true,
    StatusText: true,
    ScheduledDate: true,
    ProductGroupNumber: false,
    WorkflowRemark: true,
    Creator: false,
    CreatedAt: true,
    ProcessedBy: true,
    ProcessingTime: false,
    LastChangedBy: false,
    LastUpdatedAt: false,
    ErledigtVon: false,
    ErledigtAm: false,
    WorkflowId: true,
    actionButton: true,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<number | null>(null);
  const [activeEditRowData, setActiveEditRowData] = useState<TableData | undefined>(undefined);

  const isEditDisabled = activeEditRowData?.StatusText !== 'O';

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleEditModalOpen = (rowData: TableData) => {
    setActiveEditRowData(rowData);
    handleMenuClose();
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const filterConditions = [
        { condition: esoFilters.ESO, value: row.ItemType },
        { condition: esoFilters.EsoID, value: row.WorkflowId },
        { condition: esoFilters.SO, value: row.OrderId },
        { condition: esoFilters.Remarks, value: row.WorkflowRemark },
        { condition: esoFilters.Branch, value: row.Branch },
      ];

      const isMatch = filterConditions.every(({ condition, value }) =>
        String(value).toLowerCase().includes(condition.toLowerCase())
      );

      const isRepSoMatch =
        esoFilters.RepSO && esoFilters.SO
          ? String(row.OrderId) === esoFilters.SO || String(row.SORep) === esoFilters.SO
          : true;

      const checkSpecialMatch = () => {
        switch (esoFilters.Special) {
          case SPEACIAL_FILTER.OpenAll:
            return !row.DoneOn;
          case SPEACIAL_FILTER.OpenWithoutSO:
            return !row.DoneOn && !row.OrderId;
          case SPEACIAL_FILTER.OpenFromMeAll:
            return !row.DoneOn && !row.OrderId && row.Processor === systemUser;
          case SPEACIAL_FILTER.CreatedByMe:
            return String(row.Creator).includes(systemUser);
          case SPEACIAL_FILTER.OpenCreatedByMe:
            return !row.DoneOn && String(row.Creator).includes(systemUser);
          default:
            return true;
        }
      };

      const isSpecialMatch = checkSpecialMatch();

      return isMatch && isRepSoMatch && isSpecialMatch;
    });
  }, [data, esoFilters]);

  return (
    <>
      <Box sx={{ width: '100%' }} aria-label="Electronic Service Order Table Row">
        <CustomTable
          headCells={headCells}
          setTableData={setTableData}
          rows={filteredData}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          tableName="ElectronicServiceOrderTable"
        >
          {tableData.map((row) => {
            return (
              <Fragment key={row.Id as number}>
                <TableRow hover tabIndex={-1}>
                  {columnVisibility.ItemType && (
                    <TableCell align="left" sx={{ maxWidth: '132px' }}>
                      <OverflowTooltip text={sanitizeData(row.ItemType)} />
                    </TableCell>
                  )}
                  {columnVisibility.OrderId && <TableCell>{sanitizeData(row.OrderId)}</TableCell>}
                  {columnVisibility.AdministratorId && (
                    <TableCell>{sanitizeData(row.AdministrationId)}</TableCell>
                  )}
                  {columnVisibility.StatusText && (
                    <TableCell align="center">
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                        <Box
                          sx={{
                            borderRadius: '6px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#3366ff28',
                          }}
                        >
                          <Typography
                            variant="overline"
                            sx={{
                              fontWeight: '800',
                              color: 'info.dark',
                              lineHeight: 1,
                            }}
                          >
                            {sanitizeData(row.StatusText)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  )}
                  {columnVisibility.ScheduledDate && (
                    <TableCell
                      align="left"
                      sx={{
                        minWidth: '112px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {row.ScheduledDate ? getDateTime(String(row.ScheduledDate)) : '-'}
                    </TableCell>
                  )}
                  {columnVisibility.ProductGroupNumber && (
                    <TableCell>
                      <OverflowTooltip text={sanitizeData(row.ProductGroupNumber)} />
                    </TableCell>
                  )}
                  {columnVisibility.WorkflowRemark && (
                    <TableCell align="left" sx={{ maxWidth: '96px' }}>
                      <OverflowTooltip text={sanitizeData(row.WorkflowRemark)} />
                    </TableCell>
                  )}
                  {columnVisibility.Creator && (
                    <TableCell align="right" sx={{ maxWidth: '96px' }}>
                      <OverflowTooltip text={sanitizeData(row.Creator)} />
                    </TableCell>
                  )}
                  {columnVisibility.CreatedAt && (
                    <TableCell
                      align="left"
                      sx={{
                        minWidth: '112px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {row.CreatedAt ? getDateTime(String(row.CreatedAt)) : '-'}
                    </TableCell>
                  )}
                  {columnVisibility.ProcessedBy && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.Processor)} />
                    </TableCell>
                  )}
                  {columnVisibility.ProcessingTime && (
                    <TableCell
                      align="left"
                      sx={{
                        minWidth: '112px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {row.ProcessingTime ? formatDateTime(String(row.ProcessingTime)) : '-'}
                    </TableCell>
                  )}
                  {columnVisibility.LastChangedBy && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.LastChangedBy || '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.LastUpdatedAt && (
                    <TableCell
                      align="left"
                      sx={{
                        minWidth: '112px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {row.ProcessingTime ? formatDateTime(String(row.ProcessingTime)) : '-'}
                    </TableCell>
                  )}
                  {columnVisibility.ErledigtVon && (
                    <TableCell
                      align="left"
                      sx={{
                        maxWidth: '96px',
                        pl: row.Completed ? 2 : 5,
                      }}
                    >
                      <OverflowTooltip text={sanitizeData(row.ErledigtVon)} />
                    </TableCell>
                  )}
                  {columnVisibility.ErledigtAm && (
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: '104px',
                      }}
                    >
                      <OverflowTooltip text={sanitizeData(row.ErledigtAm)} />
                    </TableCell>
                  )}
                  {columnVisibility.WorkflowId && (
                    <TableCell>
                      <OverflowTooltip text={sanitizeData(row.WorkflowId)} />
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(e) => {
                        handleMenuClick(e, row.WorkflowId as number);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl) && menuRowId === row.WorkflowId}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      slotProps={{ paper: { sx: { minWidth: '110px' } } }}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        disableRipple
                        sx={{ gap: 1.5 }}
                        onClick={() => {
                          handleEditModalOpen(row);
                        }}
                      >
                        <Iconify icon="material-symbols:edit" />
                        {t('EDIT')}
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </CustomTable>
      </Box>

      {activeEditRowData && (
        <EditESO
          data={activeEditRowData}
          onClose={() => {
            setActiveEditRowData(undefined);
          }}
          onSumitForm={(formData) => {
            setActiveEditRowData(undefined);
            onEditModalSubmit(formData);
          }}
          isDisabled={isEditDisabled}
        />
      )}
    </>
  );
};
export default ElectronicServiceOrderTable;
