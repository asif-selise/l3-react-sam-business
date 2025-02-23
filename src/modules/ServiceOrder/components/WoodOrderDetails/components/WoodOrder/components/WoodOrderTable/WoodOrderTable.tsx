import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Iconify from '@/src/components/iconify/iconify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpsertWoodItem from '../UpsertWoodItem/UpsertWoodItem';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type WoodOrder } from '@/src/hooks/useTourData/tourData.interface';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { Checkbox, IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type WoodOrderManufacturer } from '@/src/hooks/useMasterData/masterData.interface';
import { getDate } from '@/src/helpers/formatDate';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import AddOrEditWoodOrderDetails from '../../../Details/components/AddOrEditWoodOrderDetails/AddOrEditWoodOrderDetails';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { useSelector } from '@/src/redux/store';
import { type SelectedWoodOrderDetails } from '../../../../WoodOrderDetails';

interface Props {
  data: WoodOrder[];
  isLoading: boolean;
  selectedWoodOrderID: number | null;
  setSelectedWoodOrderID: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedWoodOrderDetails: React.Dispatch<
    React.SetStateAction<SelectedWoodOrderDetails | undefined>
  >;
  onEditModalSubmit: (formData: WoodOrder) => void;
  onDeletion: (data: WoodOrder) => Promise<void>;
  onCopyPasteClick: (data: WoodOrder) => Promise<void>;
  completionStatus: boolean;
  showEditMode?: boolean;
  samOfferUId: string | null;
  samOfferId: number | null;
}

const WoodOrderTable = ({
  data,
  isLoading,
  selectedWoodOrderID,
  setSelectedWoodOrderID,
  setSelectedWoodOrderDetails,
  onEditModalSubmit,
  onDeletion,
  onCopyPasteClick,
  completionStatus,
  showEditMode = true,
  samOfferUId,
  samOfferId,
}: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('index');
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [openAddDetailsModal, setOpenAddDetailsModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<number | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<WoodOrder>();

  const tableHeaders: HeadCell[] = [
    {
      id: 'woodStock',
      label: t('WOOD_ORDER_ID'),
      sortable: false,
    },
    {
      id: 'noId',
      label: t('NO_ID'),
      sortable: false,
    },
    {
      id: 'remarks',
      label: t('REMARKS'),
      sortable: false,
    },
    {
      id: 'carpenter',
      label: t('CARPENTER'),
      sortable: false,
    },
    {
      id: 'mA',
      label: t('MA'),
      sortable: false,
    },
    {
      id: 'createdOn',
      label: t('CREATED_ON'),
      sortable: false,
    },
    {
      id: 'createdBy',
      label: t('CREATED_BY'),
      sortable: false,
    },
    {
      id: 'orderedOn',
      label: t('ORDERED_ON'),
      sortable: false,
    },
    {
      id: 'orderedFrom',
      label: t('ORDERED_FROM'),
      sortable: false,
    },
    {
      id: 'colorDefinition',
      label: t('COLOR_DEFINITION'),
      sortable: false,
    },
    {
      id: 'kitchenManufacturer',
      label: t('MANUFACTURER_OF_THE_KITCHEN'),
      sortable: false,
    },
    {
      id: 'manufacturersLabel',
      label: t('PHOTO_OF_THE_MANUFACTURERS_LABEL'),
      sortable: false,
    },
    {
      id: 'doneOrDeactivated',
      label: t('DONE_OR_DEACTIVATED'),
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
    noId: true,
    remarks: true,
    carpenter: true,
    mA: true,
    createdOn: false,
    createdBy: false,
    orderedOn: false,
    orderedFrom: false,
    colorDefinition: true,
    kitchenManufacturer: true,
    manufacturersLabel: true,
    doneOrDeactivated: true,
    actionButton: true,
  });

  const {
    dataList: woodOrderManufacturerList,
    getDataList: getWoodOrderManufacturerList,
    isLoading: manufacturerListIsLoading,
  } = useIndexedDbData<WoodOrderManufacturer>('MasterData', 'WoodOrderManufacturers');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const getManufacturerAddress = (manufacturerId: number): string => {
    const manufacturer = woodOrderManufacturerList.find((item) => item.Id === manufacturerId);
    return manufacturer ? manufacturer.Address : '';
  };

  const handleUpsertModal = (action: 'open' | 'close') => {
    if (action === 'open') setOpenEditModal(true);
    if (action === 'close') setOpenEditModal(false);
  };

  const handleEditWoodOrderSubmit = (formData: WoodOrder) => {
    const fullFormData = data.find(
      (it) => it.WoodOrderId === formData.WoodOrderId && it.UId === formData.UId
    );
    if (fullFormData) {
      const updatedData = {
        ...formData,
        SamOfferUId: fullFormData.SamOfferUId,
        ChangedBy: fullFormData.ChangedBy,
      };
      onEditModalSubmit(updatedData);
    } else {
      dispatch(showErrorMessage('NO_DATA_FOUND'));
    }
    handleUpsertModal('close');
  };

  const handleDeleteWoodOrder = (data: WoodOrder) => {
    onDeletion(data).then();
    setOpenConfirmationModal(false);
  };

  const handleWoodOrderCopyPaste = (data: WoodOrder) => {
    onCopyPasteClick(data).then();
  };

  useEffect(() => {
    getWoodOrderManufacturerList().then();
  }, []);

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={tableHeaders}
        isLoading={isLoading || manufacturerListIsLoading}
        setTableData={setTableData}
        rows={data as unknown as TableData[]}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="WoodOrderTable"
      >
        {!manufacturerListIsLoading && !isLoading && !!data.length && (
          <>
            {tableData.map((row, index) => {
              return (
                <Fragment key={index}>
                  <TableRow
                    hover
                    tabIndex={-1}
                    sx={{
                      background: row.WoodOrderId === selectedWoodOrderID ? COMMON.grey[300] : '',
                    }}
                    onClick={() => {
                      setSelectedWoodOrderDetails(undefined);
                      setSelectedWoodOrderID(row.WoodOrderId as number);
                    }}
                  >
                    {columnVisibility.woodStock && (
                      <TableCell align="left">
                        <OverflowTooltip text={sanitizeData(row.WoodOrderId)} />
                      </TableCell>
                    )}
                    {columnVisibility.noId && (
                      <TableCell align="left">{sanitizeData(row.SamOfferId)}</TableCell>
                    )}
                    {columnVisibility.remarks && (
                      <TableCell align="left">{sanitizeData(row.Remark)}</TableCell>
                    )}
                    {columnVisibility.carpenter && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={getManufacturerAddress(row.WoodOrderManufacturerId as number)}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.mA && (
                      <TableCell align="left">
                        {sanitizeData(row.TechnicianEmployeeNumber)}
                      </TableCell>
                    )}
                    {columnVisibility.createdOn && (
                      <TableCell align="left">
                        {sanitizeData(getDate(row.CreatedOn as string))}
                      </TableCell>
                    )}
                    {columnVisibility.createdBy && (
                      <TableCell align="left">{sanitizeData(row.CreatedBy)}</TableCell>
                    )}
                    {columnVisibility.orderedOn && (
                      <TableCell align="left">
                        {sanitizeData(getDate(row.OrderedOn as string))}
                      </TableCell>
                    )}
                    {columnVisibility.orderedFrom && (
                      <TableCell align="left">{sanitizeData(row.OrderedBy)}</TableCell>
                    )}
                    {columnVisibility.colorDefinition && (
                      <TableCell align="left">
                        <OverflowTooltip text={sanitizeData(row.ColorDefinition)} />
                      </TableCell>
                    )}
                    {columnVisibility.kitchenManufacturer && (
                      <TableCell align="left">
                        <OverflowTooltip text={sanitizeData(row.ManufacturerKitchen)} />
                      </TableCell>
                    )}
                    {columnVisibility.manufacturersLabel && (
                      <TableCell align="left">
                        {sanitizeData(row.PhotoManufacturerLabelMade)}
                      </TableCell>
                    )}
                    {columnVisibility.doneOrDeactivated && (
                      <TableCell align="center">
                        <Checkbox disabled checked={!!row.CompletedOrDeactivated} />
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(e) => {
                          handleMenuClick(e, row.WoodOrderId as number);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl) && menuRowId === row.WoodOrderId}
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
                        {showEditMode ? (
                          <>
                            <MenuItem
                              disabled={isSoReadOnly || completionStatus}
                              onClick={() => {
                                if (row.OrderedOn) {
                                  return dispatch(
                                    showErrorMessage(
                                      t('CHANGES_TO_THE_WOOD_ORDER_IS_NOT_PERMITTED')
                                    )
                                  );
                                }
                                setSelectedRowData(row as unknown as WoodOrder);
                                setOpenEditModal(true);
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
                                setSelectedRowData(row as unknown as WoodOrder);
                                setOpenAddDetailsModal(true);
                                handleMenuClose();
                              }}
                              disableRipple
                              sx={{ gap: 1.5 }}
                            >
                              <Iconify icon="majesticons:checkbox-list-detail" />
                              {t('ADD_DETAILS')}
                            </MenuItem>

                            <MenuItem
                              disabled={isSoReadOnly || completionStatus}
                              onClick={() => {
                                setSelectedRowData(row as unknown as WoodOrder);
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
                        ) : (
                          <MenuItem
                            disabled={isSoReadOnly || completionStatus}
                            onClick={() => {
                              // setSelectedRowData(row as unknown as WoodOrder);
                              // setOpenConfirmationModal(true);
                              handleWoodOrderCopyPaste(row as unknown as WoodOrder);
                              handleMenuClose();
                            }}
                            disableRipple
                            sx={{ gap: 1.5 }}
                          >
                            <Iconify icon="streamline:copy-paste-solid" />
                            {t('COPY_PASTE')}
                          </MenuItem>
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
      {selectedRowData && (
        <ConfirmationModal
          open={openConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('ARE_YOU_SURE_TO_DELETE_THIS_ITEM?')}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: selectedRowData.UId,
            action: () => {
              handleDeleteWoodOrder(selectedRowData as unknown as WoodOrder);
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
      {openEditModal && (
        <UpsertWoodItem
          type={'edit'}
          onClose={handleUpsertModal}
          onSubmitForm={handleEditWoodOrderSubmit}
          editData={selectedRowData}
          samOfferUId={samOfferUId}
          samOfferId={samOfferId}
        />
      )}
      {openAddDetailsModal && selectedRowData && (
        <AddOrEditWoodOrderDetails
          type={'add'}
          setOpenModal={setOpenAddDetailsModal}
          add={{ data: selectedRowData, setSelectedWoodOrderID }}
        />
      )}
    </>
  );
};
export default WoodOrderTable;
