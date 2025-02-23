import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { getDateTime } from '@/src/helpers/formatDate';
import { TableRow, TableCell } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Appointment, type AppointmentType } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { sanitizeData } from '@/src/helpers/sanitizeData';

// reason 1: feature to be implemented later
interface Props {
  data: Appointment[];
  isLoading: boolean;
}

const AbsenceCreditOverviewTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const { dataList: appointmentsTypesData, getDataList: getAppointmentsTypesData } =
    useIndexedDbData<AppointmentType>('TourPlanData', 'AppointmentTypes');

  useEffect(() => {
    getAppointmentsTypesData();
  }, []);

  const headCells: HeadCell[] = [
    { id: 'reasonForAbsence', label: t('REASON_FOR_ABSENCE'), sortable: false },
    { id: 'StartDate', label: t('FROM'), sortable: true },
    { id: 'shift', label: t('START_DATE_TIME_OF_DAY'), sortable: false },
    { id: 'EndDate', label: t('UNTIL'), sortable: true },
    { id: 'EndDateTimeOfDay', label: t('END_DATE_TIME_OF_DAY'), sortable: false },
    { id: 'DaysCount', label: t('NUMBER_OF_DAYS'), sortable: true },
    { id: 'Remark', label: t('REMARKS'), sortable: true },
    { id: 'AppointmentId', label: t('ID'), sortable: true },
    // { id: 'actionButton', label: '', sortable: false },  -- reason 1
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    reasonForAbsence: true,
    StartDate: true,
    shift: true,
    EndDate: true,
    EndDateTimeOfDay: true,
    DaysCount: true,
    Remark: true,
    AppointmentId: true,
    // actionButton: true, -- reason 1
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); -- reason 1
  // const [menuRowId, setMenuRowId] = useState<number | null>(null);

  // const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
  //   setAnchorEl(event.currentTarget);
  //   setMenuRowId(id);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   setMenuRowId(null);
  // };

  const getTimesOfDay = (key: string | null): string => {
    switch (key) {
      case 'gt':
        return t('FULL_WORKDAY');
      case 'vo':
        return t('MORNING');
      case 'na':
        return t('AFTERNOON');
      default:
        return '';
    }
  };

  return (
    <CustomTable
      headCells={headCells}
      setTableData={setTableData}
      rows={data as unknown as TableData[]}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="AbsenceCreditOverviewTable"
    >
      {tableData.map((row, index) => (
        <TableRow key={index} hover tabIndex={-1} aria-label="absence-credit-overview-row">
          {columnVisibility.reasonForAbsence && (
            <TableCell align="left">
              {sanitizeData(
                appointmentsTypesData.find((d) => d.Id === row.AppointmentTypeId)?.Description
              )}
            </TableCell>
          )}
          {columnVisibility.StartDate && (
            <TableCell align="left">{sanitizeData(getDateTime(row.StartDate as string))}</TableCell>
          )}
          {columnVisibility.shift && (
            <TableCell align="left">
              {sanitizeData(getTimesOfDay(row.StartDateTimeOfDay as string))}
            </TableCell>
          )}
          {columnVisibility.EndDate && (
            <TableCell align="left">
              {row?.EndDate ? sanitizeData(getDateTime(row.EndDate as string)) : '-'}
            </TableCell>
          )}
          {columnVisibility.EndDateTimeOfDay && (
            <TableCell align="left">
              {sanitizeData(getTimesOfDay(row.EndDateTimeOfDay as string))}
            </TableCell>
          )}
          {columnVisibility.DaysCount && (
            <TableCell align="left">{sanitizeData(row.DaysCount)}</TableCell>
          )}
          {columnVisibility.Remark && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.Remark)} />
            </TableCell>
          )}
          {columnVisibility.AppointmentId && (
            <TableCell align="left">
              <OverflowTooltip text={sanitizeData(row.AppointmentId)} />
            </TableCell>
          )}
          {/* <TableCell align="right"> -- reason 1
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
                disableRipple sx={{ gap: 1.5 }}
                onClick={() => {
                  onEditClicked(row.AppointmentId as number, row.AppointmentTypeId as number)
                }}>
                  <Iconify icon="material-symbols:edit" />
                {t('EDIT')}
              </MenuItem>
            </Menu>
          </TableCell> */}
        </TableRow>
      ))}
    </CustomTable>
  );
};

export default AbsenceCreditOverviewTable;
