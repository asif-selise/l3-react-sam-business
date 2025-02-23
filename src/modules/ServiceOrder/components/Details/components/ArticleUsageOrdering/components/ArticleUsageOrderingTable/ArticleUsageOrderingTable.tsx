import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Checkbox, IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import Iconify from '@/src/components/iconify/iconify';
import { useTranslation } from 'react-i18next';
import AddEditArticleUsageOrdering from '../AddEditArticleUsageOrdering/AddEditArticleUsageOrdering';
import { useDispatch } from 'react-redux';
import { showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import { type UsersSamOrder } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type SamTarget,
  type WarehouseLocation,
} from '@/src/hooks/useMasterData/masterData.interface';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { useSelector } from '@/src/redux/store';
import { formatCurrency } from '@/src/helpers/formatCurrency';

interface Props {
  data: TableData[];
  headCells: HeadCell[];
  isLoading: boolean;
  onEditModalSubmit: (formData: UsersSamOrder) => void;
  onCopyRow: (formData: UsersSamOrder, duplicate?: boolean) => void;
  onDeletion: (formData: UsersSamOrder) => void;
  showAllSourceStocks: boolean;
}

const ArticleUsageOrderingTable = ({
  data,
  headCells,
  isLoading,
  onEditModalSubmit,
  onCopyRow,
  onDeletion,
  showAllSourceStocks,
}: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    sWGA: false,
    anz: false,
    articleNo: true,
    articleDescription: true,
    grossIncl: true,
    grossExcl: true,
    fEASExcl: true,
    sourceStock: true,
    ver: true,
    objective: true,
    productID: false,
    bc: true,
    set: false,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<number | null>(null);
  const [activeEditRowData, setActiveEditRowData] = useState<TableData | undefined>(undefined);
  const addEditArticleUsageOrderingRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const { dataList: warehouseLocations, getDataList: getWarehouseLocations } =
    useIndexedDbData<WarehouseLocation>('MasterData', 'WarehouseLocations');

  const { dataList: samTargets, getDataList: getSamTargets } = useIndexedDbData<SamTarget>(
    'MasterData',
    'SamTargets'
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, UId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(UId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  const handleEditModalOpen = () => {
    setActiveEditRowData(tableData.find((row) => row.UId === menuRowId));
    handleMenuClose();
  };

  const handleCopyRowData = (data: TableData) => {
    onCopyRow(data as unknown as UsersSamOrder, true);
    handleMenuClose();
  };

  const handleEditModalSubmit = (formData: UsersSamOrder) => {
    setActiveEditRowData(undefined);
    onEditModalSubmit(formData);
  };

  const handleDataDeletion = (data: TableData) => {
    onDeletion(data as unknown as UsersSamOrder);
    dispatch(showSuccessMessage(t('ITEM_DELETED_SUCCESSFULLY')));
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            setActiveEditRowData(undefined);
          },
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: () => {
            addEditArticleUsageOrderingRef.current?.handleSubmitForm();
          },
        },
      ]}
    />
  );

  const getWareHouseLocation = (id: number): string | null => {
    if (warehouseLocations) {
      const location = warehouseLocations.find(
        (location: WarehouseLocation) => location.WarehouseLocationId === id
      );
      return location?.QCPTStorageLocationDetailedIncludingBusinessLocation ?? null;
    }
    return null;
  };

  const getDestinationWareHouse = (id: number): string | null => {
    if (samTargets) {
      const data = samTargets.find((item: SamTarget) => item.SamTargetId === id);
      return data?.Task ?? null;
    }
    return null;
  };

  useEffect(() => {
    getSamTargets().then();
    getWarehouseLocations().then();
  }, []);

  return (
    <>
      <CustomTable
        roundedHead={false}
        headCells={headCells}
        setTableData={setTableData}
        rows={data}
        isLoading={isLoading}
        numberOfRowsPerPage={5}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="ArticleUsageOrderingTable"
      >
        {!isLoading && !!data.length && (
          <>
            {tableData.map((row, index) => {
              return (
                <Fragment key={index}>
                  <TableRow hover tabIndex={-1}>
                    {columnVisibility.sWGA && (
                      <TableCell align="left">
                        <Checkbox disabled checked={!!row.IstSWga} />
                      </TableCell>
                    )}
                    {columnVisibility.anz && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.ProductCount ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.articleNo && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.ManufacturerArticleNumber ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.articleDescription && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.Description ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.grossIncl && (
                      <TableCell align="right">
                        {formatCurrency(row.ListPriceIncludingTax as number)}
                      </TableCell>
                    )}
                    {columnVisibility.grossExcl && (
                      <TableCell align="right">
                        {formatCurrency(row.ListPriceExcludingTax as number)}
                      </TableCell>
                    )}
                    {columnVisibility.fEASExcl && (
                      <TableCell align="right">
                        {formatCurrency(row.RecyclingFee as number)}
                      </TableCell>
                    )}
                    {columnVisibility.sourceStock && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={sanitizeData(getWareHouseLocation(row.WarehouseLocation as number))}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.ver && (
                      <TableCell align="left">
                        <Checkbox disabled checked={!!row.IsUsed} />
                      </TableCell>
                    )}
                    {columnVisibility.objective && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={sanitizeData(
                            getDestinationWareHouse(row.DestinationWarehouse as number)
                          )}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.productID && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.ProductId ?? '-'}`} />
                      </TableCell>
                    )}
                    {columnVisibility.bc && (
                      <TableCell align="left">
                        <Checkbox disabled checked={!!row.BarcodeRequiredProductType} />
                      </TableCell>
                    )}
                    {columnVisibility.set && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.IsSet ?? '-'}`} />
                      </TableCell>
                    )}

                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          handleMenuClick(e, row.UId as number);
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
                          disabled={isSoReadOnly}
                          onClick={handleEditModalOpen}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:edit" />
                          {t('EDIT')}
                        </MenuItem>

                        <MenuItem
                          disabled={isSoReadOnly}
                          onClick={() => {
                            handleCopyRowData(row);
                          }}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="material-symbols:content-copy" />
                          {t('COPY')}
                        </MenuItem>

                        <MenuItem
                          disabled={isSoReadOnly}
                          onClick={() => {
                            handleDataDeletion(row);
                          }}
                          disableRipple
                          sx={{ gap: 1.5 }}
                        >
                          <Iconify icon="dashicons:trash" />
                          {t('DELETE')}
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
        <CustomModal
          title={t('EDIT_ARTICLE_USAGE_ORDERING')}
          open
          onClose={() => {
            setActiveEditRowData(undefined);
          }}
          actions={modalActions}
        >
          <AddEditArticleUsageOrdering
            ref={addEditArticleUsageOrderingRef}
            onSubmitForm={handleEditModalSubmit}
            type="edit"
            data={activeEditRowData}
            showAllSourceStocks={showAllSourceStocks}
          />
        </CustomModal>
      )}
    </>
  );
};
export default ArticleUsageOrderingTable;
