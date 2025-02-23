import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import Iconify from '@/src/components/iconify/iconify';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type WoodOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import { IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddOrEditWoodOrderDetails from '../AddOrEditWoodOrderDetails/AddOrEditWoodOrderDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useSelector } from '@/src/redux/store';
import { getDate } from '@/src/helpers/formatDate';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { type SelectedWoodOrderDetails } from '../../../../WoodOrderDetails';

interface Props {
  selectedWoodOrderID: number | null;
  selectedWoodOrderDetails: SelectedWoodOrderDetails | undefined;
  setSelectedWoodOrderDetails: React.Dispatch<
    React.SetStateAction<SelectedWoodOrderDetails | undefined>
  >;
  showEditMode?: boolean;
  completionStatus: boolean;
}

const WoodOrderDetailsTable = ({
  selectedWoodOrderID,
  selectedWoodOrderDetails,
  setSelectedWoodOrderDetails,
  showEditMode = true,
  completionStatus,
}: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<number | null | string>(null);
  const [openEditDetailsModal, setOpenEditDetailsModal] = useState(false);
  const [editData, setEditData] = useState<WoodOrderDetail | undefined>(undefined);
  const [deleteData, setDeleteData] = useState<WoodOrderDetail | undefined>(undefined);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

  const tableHeaders: HeadCell[] = [
    {
      id: 'woodStock',
      label: t('WOOD_ORDER_ID'),
      sortable: false,
    },
    {
      id: 'qty',
      label: t('QTY'),
      sortable: false,
    },
    {
      id: 'designation',
      label: t('DESIGNATION'),
      sortable: false,
    },
    {
      id: 'massD',
      label: t('MASS_D'),
      sortable: false,
    },
    {
      id: 'massH',
      label: t('MASS_H'),
      sortable: false,
    },
    {
      id: 'massL',
      label: t('MASS_L'),
      sortable: false,
    },
    {
      id: 'edgeColor',
      label: t('COVERED_EDGES_OR_EDGE_COLOR'),
      sortable: false,
    },
    {
      id: 'surfaceColor',
      label: t('SURFACE_COLOR'),
      sortable: false,
    },
    {
      id: 'remarks',
      label: t('REMARKS'),
      sortable: false,
    },
    {
      id: 'modifiedBy',
      label: t('MODIFIED_BY'),
      sortable: false,
    },
    {
      id: 'modifiedOn',
      label: t('MODIFIED_ON'),
      sortable: false,
    },
    {
      id: 'actionButton',
      label: '',
      sortable: false,
      align: 'right',
    },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    woodStock: true,
    qty: true,
    designation: true,
    massD: true,
    massH: true,
    massL: true,
    edgeColor: true,
    surfaceColor: true,
    remarks: true,
    modifiedBy: false,
    modifiedOn: false,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  const {
    dataList: allWoodOrderDetailsList,
    getDataList: getAllWoodOrderDetailsList,
    filteredDataList: filteredWoodOrderList,
    getFilteredDataList: getFilteredWoodOrderList,
    updateDataList: updateWoodOrderDetailsList,
    isLoading,
  } = useIndexedDbData<WoodOrderDetail>('TourPlanData', 'WoodOrderDetails');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number | string) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteWoodOrderDetails = async () => {
    if (deleteData) {
      const updatedWoodOrderDetailsList = allWoodOrderDetailsList.filter(
        (item) => item.UId !== deleteData.UId
      );

      await updateWoodOrderDetailsList(
        updatedWoodOrderDetailsList,
        deleteData,
        'DeleteRecords',
        'WoodOrderDetailsUpdateRequestModel'
      );
      await getFilteredWoodOrderList('WoodOrderId', deleteData.WoodOrderId);

      setDeleteData(undefined);
      dispatch(showSuccessMessage(t('ITEM_DELETED_SUCCESSFULLY')));
      setOpenConfirmationModal(false);
      return;
    }
    return dispatch(showErrorMessage(t('SOMETHING_WENT_WRONG')));
  };

  useEffect(() => {
    if (selectedWoodOrderID) {
      getFilteredWoodOrderList('WoodOrderId', selectedWoodOrderID).then();
    }
  }, [selectedWoodOrderID]);

  const handleSelectedWoodOrderDetails = (WoodOrderDetailId: number, isNew: boolean = false) => {
    if (WoodOrderDetailId === selectedWoodOrderDetails?.Id) {
      setSelectedWoodOrderDetails(undefined);
    } else {
      setSelectedWoodOrderDetails({ Id: WoodOrderDetailId, isNew });
    }
  };

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={tableHeaders}
        isLoading={isLoading}
        setTableData={setTableData}
        rows={filteredWoodOrderList as unknown as TableData[]}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="WoodOrderDetailsTable"
      >
        {!isLoading && (
          <>
            {tableData.map((row) => {
              return (
                <Fragment key={row.id as number}>
                  <TableRow
                    hover
                    tabIndex={-1}
                    onClick={() => {
                      handleSelectedWoodOrderDetails(
                        row.WoodOrderDetailId as number,
                        row.isNew as boolean
                      );
                    }}
                    sx={{
                      cursor: 'pointer',
                      background:
                        row.WoodOrderDetailId === selectedWoodOrderDetails?.Id
                          ? COMMON.grey[300]
                          : '',
                    }}
                  >
                    {columnVisibility.woodStock && (
                      <TableCell align="left"> {sanitizeData(row.WoodOrderId)}</TableCell>
                    )}
                    {columnVisibility.qty && (
                      <TableCell align="left">{sanitizeData(row.Quantity)}</TableCell>
                    )}
                    {columnVisibility.designation && (
                      <TableCell align="left">{sanitizeData(row.Description)}</TableCell>
                    )}
                    {columnVisibility.massD && (
                      <TableCell align="left">{sanitizeData(row.DMassD)}</TableCell>
                    )}
                    {columnVisibility.massH && (
                      <TableCell align="left">{sanitizeData(row.DMassH)}</TableCell>
                    )}
                    {columnVisibility.massL && (
                      <TableCell align="left">{sanitizeData(row.DMassL)}</TableCell>
                    )}
                    {columnVisibility.edgeColor && (
                      <TableCell align="left">{sanitizeData(row.EdgeDetailEdgeColor)}</TableCell>
                    )}
                    {columnVisibility.surfaceColor && (
                      <TableCell align="left">{sanitizeData(row.EdgeDetailSurfaceColor)}</TableCell>
                    )}
                    {columnVisibility.remarks && (
                      <TableCell align="left">{sanitizeData(row.Remark)}</TableCell>
                    )}
                    {columnVisibility.modifiedBy && (
                      <TableCell align="left">{sanitizeData(row.CreatedBy)}</TableCell>
                    )}
                    {columnVisibility.modifiedOn && (
                      <TableCell align="left">
                        {sanitizeData(getDate(row.ChangedOn as string))}
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
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
                        {showEditMode && (
                          <>
                            <MenuItem
                              disabled={isSoReadOnly || completionStatus}
                              onClick={async () => {
                                setEditData(row as unknown as WoodOrderDetail);
                                setOpenEditDetailsModal(true);
                                handleMenuClose();
                              }}
                              disableRipple
                              sx={{ gap: 1.5 }}
                            >
                              <Iconify icon="material-symbols:edit" />
                              {t('EDIT')}
                            </MenuItem>
                            <MenuItem
                              disabled={isSoReadOnly || completionStatus}
                              onClick={() => {
                                getAllWoodOrderDetailsList();
                                setDeleteData(row as unknown as WoodOrderDetail);
                                setOpenConfirmationModal(true);
                                handleMenuClose();
                              }}
                              disableRipple
                              sx={{ gap: 1.5 }}
                            >
                              <Iconify icon="dashicons:trash" />
                              {t('DELETE')}
                            </MenuItem>
                          </>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </>
        )}
      </CustomTable>
      {deleteData && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('ARE_YOU_SURE_TO_DELETE_THIS_ITEM?')}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: deleteData.UId,

            action: () => {
              handleDeleteWoodOrderDetails();
            },
          }}
          discardButton={{
            title: t('NO'),
            variant: 'contained',
            action: () => {
              setOpenConfirmationModal(false);
            },
          }}
        />
      )}
      {openEditDetailsModal && editData && (
        <AddOrEditWoodOrderDetails
          type={'edit'}
          setOpenModal={setOpenEditDetailsModal}
          edit={{ data: editData, setEditData, getFilteredWoodOrderList }}
        />
      )}
    </>
  );
};
export default WoodOrderDetailsTable;
