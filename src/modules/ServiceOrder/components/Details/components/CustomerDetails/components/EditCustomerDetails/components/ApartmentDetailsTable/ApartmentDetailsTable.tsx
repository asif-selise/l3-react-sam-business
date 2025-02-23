import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from '@/src/components/iconify/iconify';
import { type ApartmentDetail } from '@/src/hooks/useTourData/tourData.interface';
import { useSelector } from '@/src/redux/store';
import { getDate } from '@/src/helpers/formatDate';

interface Props {
  data: TableData[];
  isLoading: boolean;
  onEdit: (row: ApartmentDetail) => void;
  onSelect: (apartmentGuid: string) => void;
}

const ApartmentDetailsTable = ({ data, isLoading, onEdit, onSelect }: Props) => {
  const { t } = useTranslation('index');
  const isReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const headCells: HeadCell[] = [
    {
      id: 'apartmentNoCustomer',
      label: t('APARTMENT_NO_CUSTOMER'),
      sortable: false,
      align: 'left',
    },
    { id: 'apartmentNoOwner', label: t('APARTMENT_NO_OWNER'), sortable: false, align: 'left' },
    { id: 'remarks', label: t('REMARKS'), sortable: false, align: 'left' },
    { id: 'lastTenant', label: t('LAST_TENANT'), sortable: false, align: 'left' },
    {
      id: 'administrationNumber',
      label: t('ADMINISTRATIVE_NO'),
      sortable: false,
      align: 'left',
    },
    { id: 'administration', label: t('ADMINISTRATION'), sortable: false, align: 'left' },
    { id: 'owner', label: t('OWNER'), sortable: false, align: 'left' },
    { id: 'ownerNo', label: t('OWNER_NO'), sortable: false, align: 'left' },
    { id: 'floor', label: t('FLOOR_USAGE'), sortable: false, align: 'left' },
    {
      id: 'apartmentDetailsManage',
      label: t('APARTMENT_DETAILS_MANAGE'),
      sortable: false,
      align: 'left',
    },
    { id: 'changedBy', label: t('CHANGED_BY'), sortable: false, align: 'left' },
    { id: 'changedOn', label: t('CHANGED_ON'), sortable: false, align: 'left' },
    { id: 'apartmentId', label: t('APARTMENT_ID'), sortable: false, align: 'left' },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    apartmentNoCustomer: true,
    apartmentNoOwner: true,
    remarks: true,
    lastTenant: true,
    administrationNumber: true,
    administration: false,
    owner: false,
    ownerNo: false,
    floor: false,
    apartmentDetailsManage: false,
    changedBy: false,
    changedOn: false,
    apartmentId: false,
    actionButton: true,
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, UId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(UId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  return (
    <>
      {!!data?.length && (
        <CustomTable
          headCells={headCells}
          setTableData={setTableData}
          rows={data}
          isLoading={isLoading}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          tableName="ApartmentDetailsTable"
        >
          {tableData.map((row) => (
            <Fragment key={`${row.UId}`}>
              <TableRow hover sx={{ cursor: 'pointer' }}>
                {columnVisibility.apartmentNoCustomer && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={sanitizeData(row.CustomerApartmentNumber)}
                      variant={'body2'}
                    />
                  </TableCell>
                )}
                {columnVisibility.apartmentNoOwner && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={sanitizeData(row.OwnerApartmentNumber)}
                      variant={'body2'}
                    />
                  </TableCell>
                )}
                {columnVisibility.remarks && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.Remarks)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.lastTenant && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.LastTenant)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.administrationNumber && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.AdministrationId)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.administration && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={sanitizeData(row.AdministrationName)}
                      variant={'body2'}
                    />
                  </TableCell>
                )}
                {columnVisibility.owner && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.OwnerId)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.ownerNo && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.OwnerName)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.floor && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={sanitizeData(row.AdministrationApartmentFloor)}
                      variant={'body2'}
                    />
                  </TableCell>
                )}
                {columnVisibility.apartmentDetailsManage && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={sanitizeData(row.AdministrationApartmentDetails)}
                      variant={'body2'}
                    />
                  </TableCell>
                )}
                {columnVisibility.changedBy && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.ChangedBy)} variant={'body2'} />
                  </TableCell>
                )}
                {columnVisibility.changedOn && (
                  <TableCell align="left">
                    <OverflowTooltip
                      text={`${row.ChangedOn ? getDate(String(row.ChangedOn)) : '-'}`}
                    />
                  </TableCell>
                )}
                {columnVisibility.apartmentId && (
                  <TableCell align="left">
                    <OverflowTooltip text={sanitizeData(row.ApartmentId)} variant={'body2'} />
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
                      disabled={isReadOnly}
                      onClick={() => {
                        onEdit(row as unknown as ApartmentDetail);
                      }}
                      disableRipple
                      sx={{ gap: 1.5 }}
                    >
                      <Iconify icon="material-symbols:edit" />
                      {t('EDIT')}
                    </MenuItem>
                    <MenuItem
                      disabled={isReadOnly}
                      onClick={() => {
                        onSelect(row.ApartmentGuid as string);
                      }}
                      disableRipple
                      sx={{ gap: 1.5 }}
                    >
                      <Iconify icon="fluent:select-all-on-16-filled" />
                      {t('SELECT_APARTMENT')}
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </CustomTable>
      )}
    </>
  );
};

export default ApartmentDetailsTable;
