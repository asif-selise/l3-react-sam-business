import CustomTable from '@/src/components/CustomTable/CustomTable';
import type { HeadCell, TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { Checkbox, IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from '@/src/components/iconify/iconify';
import { useTranslation } from 'react-i18next';
import AddEditPersonalExpenses from './AddEditPersonalExpenses';
import { type PersonalEffort } from '@/src/hooks/useTourData/tourData.interface';
import { useSelector } from '@/src/redux/store';
import { type NoSecondCourseReasons } from '@/src/hooks/useMasterData/masterData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { revertDateTime1900 } from '../../../KVEstimatedCost/utils/helpers';
import { isDefined } from '@/src/helpers/genericFunctions';
import { convertToUtcFormatedDate, isToday } from '@/src/helpers/formatDateByLuxon';

interface Props {
  data: PersonalEffort[];
  headCells: HeadCell[];
  isLoading: boolean;
  onEditModalSubmit: (formData: PersonalEffort) => void;
  onDeleteSubmit: (formData: PersonalEffort) => void;
}

const PersonalExpensesTable = ({
  data,
  headCells,
  isLoading,
  onEditModalSubmit,
  onDeleteSubmit,
}: Props) => {
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);
  const [activeEditRowData, setActiveEditRowData] = useState<PersonalEffort | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Date: false,
    TechnicianNumber: false,
    TechnicianName: true,
    Start: true,
    End: true,
    TravelTime: true,
    Code: false,
    WorkFromHome: true,
    NoSecondWayReason: false,
    actionButton: true,
  });

  const { dataList: noSecondCourseReasonsData, getDataList: getNoSecondCourseReasonsData } =
    useIndexedDbData<NoSecondCourseReasons>('MasterData', 'NoSecondCourseReasons');

  useEffect(() => {
    getNoSecondCourseReasonsData().then();
  }, []);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const isEditable = () => {
    if (isSoReadOnly) {
      return true;
    }
    const formData = data.find((item) => item.UId === menuRowId);
    return !(
      isDefined(formData) &&
      (formData.TechnicianEmployeeNumber === null || isToday(formData.Date))
    );
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleEditModalOpen = () => {
    setActiveEditRowData(data.find((item) => item.UId === menuRowId));
    handleMenuClose();
  };

  const handleDeleteAction = () => {
    const formData = data.find((item) => item.UId === menuRowId);
    if (isDefined(formData)) {
      onDeleteSubmit(formData);
    }
    handleMenuClose();
  };

  const handleEditModalClose = () => {
    setActiveEditRowData(undefined);
  };

  const handleEditModalSubmit = (formData: PersonalEffort) => {
    setActiveEditRowData(undefined);
    onEditModalSubmit(formData);
  };

  const getNoSecondWayReason = (value: string | number | boolean) => {
    return noSecondCourseReasonsData.find((data) => data.Id === value)?.Reason;
  };

  return (
    <>
      <CustomTable
        headCells={headCells}
        setTableData={setTableData}
        rows={data as unknown as TableData[]}
        isLoading={isLoading}
        numberOfRowsPerPage={5}
        roundedHead={false}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="PersonalExpensesTable"
      >
        {!isLoading && !!data.length && (
          <>
            {tableData.map((row) => {
              return (
                <Fragment key={row.PersonalEffortId as number}>
                  <TableRow hover tabIndex={-1}>
                    {columnVisibility.Date && (
                      <TableCell>
                        <OverflowTooltip
                          text={`${convertToUtcFormatedDate(row.Date as string) ?? '-'}`}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.TechnicianNumber && (
                      <TableCell>
                        <OverflowTooltip text={(row.TechnicianEmployeeNumber as string) ?? '-'} />
                      </TableCell>
                    )}
                    {columnVisibility.TechnicianName && (
                      <TableCell>
                        <OverflowTooltip text={row.TechnicianName as string} />
                      </TableCell>
                    )}
                    {columnVisibility.Start && (
                      <TableCell>{revertDateTime1900(row.Start as string)}</TableCell>
                    )}
                    {columnVisibility.End && (
                      <TableCell>{revertDateTime1900(row.End as string)}</TableCell>
                    )}
                    {columnVisibility.TravelTime && (
                      <TableCell>
                        <OverflowTooltip text={`${row.TravelTime ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.Code && (
                      <TableCell>
                        <OverflowTooltip text={`${row.Code ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.WorkFromHome && (
                      <TableCell align="center">
                        <Checkbox checked={!!row.WorkFromHome} disabled />
                      </TableCell>
                    )}
                    {columnVisibility.NoSecondWayReason && (
                      <TableCell>
                        <OverflowTooltip
                          text={`${getNoSecondWayReason(row.NoSecondWayReason) ?? '-'}`}
                        />
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <IconButton
                        aria-label="action-buttons"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(e) => {
                          handleMenuClick(e, row.UId as string);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl) && menuRowId === row.UId}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        slotProps={{ paper: { sx: { minWidth: '110px' } } }}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          disabled={isEditable()}
                          onClick={handleEditModalOpen}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:edit" />
                          {t('EDIT')}
                        </MenuItem>
                        <MenuItem
                          disabled={isEditable()}
                          onClick={handleDeleteAction}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:delete" /> {t('DELETE')}
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </>
        )}
      </CustomTable>
      {activeEditRowData && (
        <AddEditPersonalExpenses
          type={'edit'}
          onClose={handleEditModalClose}
          onSubmitForm={handleEditModalSubmit}
          data={activeEditRowData}
        />
      )}
    </>
  );
};

export default PersonalExpensesTable;
