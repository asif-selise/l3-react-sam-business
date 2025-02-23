import { getData } from '@/indexedDb';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { Box, Button, TableCell, TableRow } from '@mui/material';
import React, { type Dispatch, Fragment, type SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type IOrdersWGAData } from './interfaces';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { type View } from '../../OrdersWGA';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { set } from 'idb-keyval';
import { useDispatch } from 'react-redux';
import { showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { type UpdateAPIData } from '@/src/hooks/useUpdateAPI/interface';
import { type IOrdersWGADataModel } from '@/src/hooks/useOrdersWGAData/interfaces';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

interface Props {
  setCurrentView: Dispatch<SetStateAction<View>>;
}

const OrdersWGATable = ({ setCurrentView }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const [ordersWGAData, setOrdersWGAData] = useState<IOrdersWGAData[] | []>([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<IOrdersWGAData | undefined>(undefined);

  const headCells: HeadCell[] = [
    { id: 'number', label: t('NUMBER'), sortable: true },
    { id: 'articleNo', label: t('ARTICLE_NO'), sortable: true },
    { id: 'product', label: t('PRODUCT'), sortable: true },
    { id: 'syncAttempt', label: t('SYNC_ATTEMPT'), sortable: false, align: 'center' },
    { id: 'productId', label: t('PRODUCT_ID'), sortable: false },
    { id: 'id', label: t('ID'), sortable: false },
    { id: 'actionButton', label: '', sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    number: true,
    articleNo: true,
    product: true,
    syncAttempt: true,
    productId: true,
    id: true,
    actionButton: true,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  const getOrdersWGAData = async () => {
    const currentData = await getData('OrdersWGAData', 'data');
    setOrdersWGAData(currentData as IOrdersWGAData[]);
  };

  const deleteFromUpdateIndexDb = async (allData: UpdateAPIData, id: string) => {
    const withoutDeletedData = allData.SamOrderWgaUploadOnlyUpdateRequestModel.InsertRecords.filter(
      (item: IOrdersWGAData) => item.UId !== id
    );

    const updatedAllData = {
      ...allData,
      SamOrderWgaUploadOnlyUpdateRequestModel: {
        ...allData.SamOrderWgaUploadOnlyUpdateRequestModel,
        InsertRecords: withoutDeletedData,
      },
    };

    await set('UpdatedData', JSON.stringify(updatedAllData));
  };

  const deleteFromOrdersWGAIndexDb = async (allData: IOrdersWGADataModel, id: string) => {
    const updatedData = {
      ...allData,
      data: allData.data.filter((item: IOrdersWGAData) => item.UId !== id),
    };

    await set('OrdersWGAData', JSON.stringify(updatedData));
  };

  const deleteOrder = async (UId: string) => {
    const allUpdatedIDbData = await getData('UpdatedData');
    const allOrderWGAData = await getData('OrdersWGAData');

    await deleteFromUpdateIndexDb(allUpdatedIDbData as UpdateAPIData, UId);
    await deleteFromOrdersWGAIndexDb(allOrderWGAData as IOrdersWGADataModel, UId);

    getOrdersWGAData();

    dispatch(showSuccessMessage(t('ORDER_DELETED')));
    setOpenConfirmationModal(false);
  };
  useEffect(() => {
    getOrdersWGAData();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '0px 0px 24px 24px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentView('selectProduct');
          }}
        >
          {t('ADD_NEW')}
        </Button>
      </Box>

      <CustomTable
        roundedHead={true}
        headCells={headCells}
        setTableData={setTableData}
        rows={(ordersWGAData as unknown as TableData[]) || []}
        numberOfRowsPerPage={10}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="OrdersWGATable"
      >
        {ordersWGAData && ordersWGAData.length > 0 && (
          <>
            {tableData.map((row) => {
              return (
                <Fragment key={row.SamOrderWgaUploadOnlyId as number}>
                  <TableRow hover tabIndex={-1}>
                    {columnVisibility.number && <TableCell align="left"> {row.Quantity}</TableCell>}
                    {columnVisibility.articleNo && (
                      <TableCell align="left">{row.ArticleNumber}</TableCell>
                    )}
                    {columnVisibility.product && (
                      <TableCell align="left">{row.ProductText}</TableCell>
                    )}
                    {columnVisibility.syncAttempt && (
                      <TableCell align="center">
                        {row.IsSynchronizing ? (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: 'success.main',
                            }}
                          />
                        ) : (
                          <CancelOutlinedIcon
                            sx={{
                              color: 'error.main',
                            }}
                          />
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.productId && (
                      <TableCell align="left">{row.ProductId}</TableCell>
                    )}
                    {columnVisibility.id && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.SamOrderWgaUploadOnlyId}`} />
                      </TableCell>
                    )}

                    <TableCell align="left">
                      <Button
                        variant="outlined"
                        disabled={!!row.IsSynchronizing}
                        sx={{ color: 'error.main' }}
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setDeleteData(row as unknown as IOrdersWGAData);
                          setOpenConfirmationModal(true);
                        }}
                      >
                        {t('DELETE')}
                      </Button>
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
              deleteOrder(deleteData.UId as unknown as string);
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
    </>
  );
};

export default OrdersWGATable;
