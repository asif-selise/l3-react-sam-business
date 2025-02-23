import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import Iconify from '@/src/components/iconify/iconify';
import { getDate } from '@/src/helpers/formatDate';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type SamOfferType } from '@/src/hooks/useMasterData/masterData.interface';
import { type SamOffer } from '@/src/hooks/useTourData/tourData.interface';
import { IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { type Dispatch, Fragment, type SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { type IStep } from '../../Offer';
import CreateOffer from '../../../CreateOffer/CreateOffer';
import { useSelector } from '@/src/redux/store';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import { isDefined } from '@/src/helpers/genericFunctions';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';

interface Props {
  SORep: number;
  data: SamOffer[];
  isLoading: boolean;
  getOfferList: (condition: (item: SamOffer) => boolean) => Promise<SamOffer[]>;
  handleWoodOrderModal: (samOfferCopyId: number, samOfferCopyUId: string) => void;
  openOfferForCopy: boolean;
  setOpenOfferForCopy: Dispatch<SetStateAction<boolean>>;
}

const OfferTable = ({
  SORep,
  data,
  isLoading,
  getOfferList,
  handleWoodOrderModal,
  openOfferForCopy,
  setOpenOfferForCopy,
}: Props) => {
  const { t } = useTranslation('index');
  const serviceOrderID = useSelector((state: any) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');
  const dispatch = useDispatch();

  const tableHeaders: HeadCell[] = [
    {
      id: 'so',
      label: t('SO'),
      sortable: false,
    },
    {
      id: 'newOffer',
      label: t('NEW_OFFER'),
      sortable: true,
    },
    {
      id: 'remarks',
      label: t('REMARKS'),
      sortable: false,
    },
    {
      id: 'releaseOn',
      label: t('RELEASE_ON'),
      sortable: false,
    },
    {
      id: 'createdOn',
      label: t('CREATED_ON'),
      sortable: false,
    },
    {
      id: 'takenOverFrom',
      label: t('TAKEN_OVER_FROM'),
      sortable: false,
    },
    {
      id: 'takenOverOn',
      label: t('TAKEN_OVER_ON'),
      sortable: false,
    },
    {
      id: 'changedOn',
      label: t('CHANGED_ON'),
      sortable: false,
    },
    {
      id: 'changedFrom',
      label: t('CHANGED_FROM'),
      sortable: false,
    },
    {
      id: 'actionButton',
      label: '',
      align: 'center',
      sortable: false,
    },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    so: true,
    newOffer: true,
    remarks: true,
    releaseOn: true,
    createdOn: true,
    takenOverFrom: false,
    takenOverOn: true,
    changedOn: true,
    changedFrom: false,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);
  const [activeEditRowData, setActiveEditRowData] = useState<SamOffer | undefined>();
  const [currentStep, setCurrentStep] = useState<IStep>(1);
  const [openEditOfferModal, setOpenEditOfferModal] = useState(false);
  const [actionType, setActionType] = useState<'copy' | 'edit' | null>(null);
  const [samOfferCopyUId, setSamOfferCopyUId] = useState<string>('');
  const [samOfferCopyId, setSamOfferCopyId] = useState<number>(0);
  const [menuDisabledStatus, setMenuDisabledStatus] = useState<boolean>(false);

  const { dataList: samOfferTypes, getDataList: getSamOfferTypes } = useIndexedDbData<SamOfferType>(
    'MasterData',
    'SamOfferTypes'
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    if (menuRowId !== id) {
      setMenuRowId(id);
    }
    if (isDefined(id)) {
      const status = getMenuDisabledStatus(id);
      setMenuDisabledStatus(status);
    }
  };

  const getMenuDisabledStatus = (uid: string) => {
    if (isSoReadOnly) {
      return true;
    }

    const currentOffer = data.find((it) => it.UId === uid);

    if (
      isDefined(currentOffer) &&
      isDefined(currentOffer.TakenOverUser?.trim()) &&
      currentOffer.TakenOverUser?.trim() !== ''
    ) {
      dispatch(
        showErrorMessage(
          t('ERROR_MUTATIONS_NOT_ALLOWED_OFFER_ALREADY_TRANSFERRED_CONTACT_VKO', {
            ServiceOrderId: serviceOrderID,
            SamOfferId: currentOffer.SamOfferId,
          })
        )
      );
      return true;
    }

    return false;
  };

  const getNewOffer = (id: number): string | null => {
    if (samOfferTypes) {
      const newOffer = samOfferTypes.find((type: SamOfferType) => type.SamOfferTypeId === id);
      return newOffer?.Type ?? null;
    }
    return null;
  };

  const setActiveData = async () => {
    const selectedRowData = data.find((item) => item.UId === menuRowId);

    if (selectedRowData && selectedRowData !== activeEditRowData) {
      setActiveEditRowData(selectedRowData);
    }
  };

  const handleEditModalOpen = async () => {
    handleMenuClose();
    await setActiveData();

    setActionType('edit');
    setOpenEditOfferModal(true);
  };

  const handleCopyModalOpen = async () => {
    setSamOfferCopyId(getUniqueNumber());
    setSamOfferCopyUId(getUniqueID());

    handleMenuClose();

    handleWoodOrderModal(samOfferCopyId, samOfferCopyUId);

    await setActiveData();
    setActionType('copy');
    setOpenEditOfferModal(true);
  };

  const handleEditModalClose = (action: 'save' | 'discard') => {
    if (action === 'save') {
      getOfferList((item) => item.OrderId === Number(serviceOrderID) || item.OrderId === SORep);
    }
    setActiveEditRowData(undefined);
    setActionType(null);
    setOpenEditOfferModal(false);
    setCurrentStep(1);
    setOpenOfferForCopy(false);
  };

  useEffect(() => {
    getSamOfferTypes().then();
  }, []);

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={tableHeaders}
        isLoading={isLoading}
        setTableData={setTableData}
        rows={data as unknown as TableData[]}
        numberOfRowsPerPage={5}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="OfferTable"
      >
        {!isLoading && !!data.length && (
          <>
            {tableData.map((row) => {
              return (
                <Fragment key={row.id as number}>
                  <TableRow hover tabIndex={-1}>
                    {columnVisibility.so && <TableCell> {sanitizeData(row.OrderId)}</TableCell>}
                    {columnVisibility.newOffer && (
                      <TableCell>{sanitizeData(getNewOffer(row.SamOfferType as number))}</TableCell>
                    )}
                    {columnVisibility.remarks && (
                      <TableCell>
                        <OverflowTooltip text={sanitizeData(row.Remark)} />
                      </TableCell>
                    )}
                    {columnVisibility.releaseOn && (
                      <TableCell>{sanitizeData(row.ApprovalDate)}</TableCell>
                    )}
                    {columnVisibility.createdOn && (
                      <TableCell>{getDate(row.CreatedAt as string)}</TableCell>
                    )}
                    {columnVisibility.takenOverFrom && (
                      <TableCell>{sanitizeData(row.TakenOverUser)}</TableCell>
                    )}
                    {columnVisibility.takenOverOn && (
                      <TableCell>{sanitizeData(getDate(row.TakenOverAt as string))}</TableCell>
                    )}
                    {columnVisibility.changedOn && (
                      <TableCell>{sanitizeData(getDate(row.UpdatedAt as string))}</TableCell>
                    )}
                    {columnVisibility.changedFrom && (
                      <TableCell>{sanitizeData(row.ChangedByNo)}</TableCell>
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
                          disabled={menuDisabledStatus}
                          onClick={handleEditModalOpen}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:edit" />
                          {t('EDIT')}
                        </MenuItem>
                        <MenuItem
                          disabled={menuDisabledStatus}
                          onClick={handleCopyModalOpen}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:content-copy" />
                          {t('COPY')}
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

      {((actionType === 'copy' && openOfferForCopy) || actionType === 'edit') &&
        activeEditRowData?.SamOfferId && (
          <CreateOffer
            type={'edit'}
            open={openEditOfferModal}
            onCancel={handleEditModalClose}
            samOfferUId={activeEditRowData.UId}
            samOfferId={activeEditRowData.SamOfferId}
            isNewSamOffer={false}
            isCopy={actionType === 'copy'}
            samOfferCopyId={samOfferCopyId}
            samOfferCopyUId={samOfferCopyUId}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
    </>
  );
};
export default OfferTable;
