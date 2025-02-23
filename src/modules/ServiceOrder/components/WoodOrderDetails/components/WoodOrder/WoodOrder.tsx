import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type WoodOrderDetail,
  type WoodOrder as IWoodOrder,
} from '@/src/hooks/useTourData/tourData.interface';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import WoodOrderTable from './components/WoodOrderTable/WoodOrderTable';
import UpsertWoodItem from './components/UpsertWoodItem/UpsertWoodItem';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useDispatch } from 'react-redux';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';
import { useSelector } from '@/src/redux/store';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import { type SelectedWoodOrderDetails } from '../../WoodOrderDetails';

interface Props {
  selectedWoodOrderID: number | null;
  samOfferUId: string | null;
  samOfferId: number | null;
  setSelectedWoodOrderID: Dispatch<SetStateAction<number | null>>;
  setSelectedWoodOrderDetails: React.Dispatch<
    React.SetStateAction<SelectedWoodOrderDetails | undefined>
  >;
  completionStatus: boolean;
  showEditMode?: boolean;
  showSamOfferWoodOrders: boolean;
}

const WoodOrder = ({
  setSelectedWoodOrderID,
  samOfferUId,
  samOfferId,
  selectedWoodOrderID,
  completionStatus,
  setSelectedWoodOrderDetails,
  showEditMode = true,
  showSamOfferWoodOrders,
}: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');
  const dispatch = useDispatch();

  const [openAddModal, setOpenAddModal] = useState(false);

  const { getDataList: getAllWoodOrderDetailsList, updateDataList: updateWoodOrderDetailsList } =
    useIndexedDbData<WoodOrderDetail>('TourPlanData', 'WoodOrderDetails');

  const {
    dataList: allWoodOrderList,
    getDataList: getAllWoodOrderList,
    filteredDataList: woodOrderList,
    getFilteredDataList: getWoodOrderList,
    updateDataList: updateWoodOrderList,
    isLoading,
  } = useIndexedDbData<IWoodOrder>('TourPlanData', 'WoodOrders');

  const handleUpsertModal = (action: 'open' | 'close') => {
    if (action === 'open') setOpenAddModal(true);
    if (action === 'close') setOpenAddModal(false);
  };

  const updateData = async (data: IWoodOrder, actionType: IActionType) => {
    if (!allWoodOrderList) {
      return dispatch(showErrorMessage(t('DATA_FETCH_ERROR')));
    }

    let updatedWoodOrderList: IWoodOrder[] = [];

    switch (actionType) {
      case 'InsertRecords':
      case 'CopyPaste':
        updatedWoodOrderList = [...allWoodOrderList, data];

        dispatch(showSuccessMessage(t('NEW_ITEM_ADDED_SUCCESSFULLY')));
        setOpenAddModal(false);
        break;

      case 'UpdateRecords':
        updatedWoodOrderList = allWoodOrderList.map((item) =>
          item.UId === data.UId ? data : item
        );

        dispatch(showSuccessMessage(t('ITEM_UPDATED_SUCCESSFULLY')));
        break;

      case 'DeleteRecords':
        updatedWoodOrderList = allWoodOrderList.filter((item) => item.UId !== data.UId);

        dispatch(showSuccessMessage(t('ITEM_DELETED_SUCCESSFULLY')));
        // Setting an absurd value so that the Details table gets rendered
        setSelectedWoodOrderID(-1);
        break;
    }

    await updateWoodOrderList(
      updatedWoodOrderList,
      data,
      actionType === 'CopyPaste' ? 'InsertRecords' : actionType,
      'WoodOrdersUpdateRequestModel'
    );

    getWoodOrderList('OrderId', Number(id)).then();
  };

  const addWoodOrderItem = async (formData: IWoodOrder) => {
    updateData(formData, 'InsertRecords').then();
  };

  const editWoodOrderItem = async (formData: IWoodOrder) => {
    updateData(formData, 'UpdateRecords').then();
  };

  const deleteWoodOrderItem = async (data: IWoodOrder) => {
    await updateData(data, 'DeleteRecords');
    // Deleting all the WoodOrder details for the responsible WoodOrderId that has been deleted
    const allWoodOrderDetailsList = await getAllWoodOrderDetailsList();

    if (allWoodOrderDetailsList !== null && allWoodOrderDetailsList.length > 0) {
      const updatedWoodOrderDetailsList = allWoodOrderDetailsList.filter(
        (item) => item.WoodOrderId !== data.WoodOrderId
      );
      const deletedWoodOrderDetailsList = allWoodOrderDetailsList.filter(
        (item) => item.WoodOrderId === data.WoodOrderId
      );

      await updateWoodOrderDetailsList(
        updatedWoodOrderDetailsList,
        deletedWoodOrderDetailsList,
        'DeleteRecords',
        'WoodOrderDetailsUpdateRequestModel'
      );
    }
  };

  const copyPasteWoodOrderDetails = async (data: IWoodOrder) => {
    const updatedData = {
      ...data,
      UId: getUniqueID(),
      WoodOrderId: getUniqueNumber(),
      SamOfferUId: samOfferUId,
      SamOfferId: samOfferId,
    };
    await updateData(updatedData, 'CopyPaste');

    const allWoodOrderDetailsList = await getAllWoodOrderDetailsList();

    if (allWoodOrderDetailsList) {
      const updatedWoodOrderDetailsList =
        allWoodOrderDetailsList?.filter((it) => it.WoodOrderId === data.WoodOrderId) ?? [];

      const newAddedWoodOrderDetailsList: WoodOrderDetail[] = [];

      if (allWoodOrderDetailsList && updatedWoodOrderDetailsList.length > 0) {
        for (const woodOrderDetail of updatedWoodOrderDetailsList) {
          const copy = {
            ...woodOrderDetail,
            UId: getUniqueID(),
            WoodOrderDetailId: getUniqueNumber(),
            WoodOrderUId: updatedData.UId,
            WoodOrderId: updatedData.WoodOrderId,
          };
          newAddedWoodOrderDetailsList.push(copy);
        }
      }

      if (newAddedWoodOrderDetailsList.length > 0) {
        const copyPastedWoodOrderDetailsList = allWoodOrderDetailsList.concat(
          newAddedWoodOrderDetailsList
        );

        await updateWoodOrderDetailsList(
          copyPastedWoodOrderDetailsList,
          newAddedWoodOrderDetailsList,
          'InsertRecords',
          'WoodOrderDetailsUpdateRequestModel'
        );
      }
    }

    dispatch(showSuccessMessage('Copy & Pasted successfully'));
  };

  useEffect(() => {
    if (id) {
      getAllWoodOrderList().then();
      getWoodOrderList('OrderId', Number(id)).then();
    }
  }, [id]);

  const getWoodOrderListForTable = () => {
    if (showSamOfferWoodOrders && samOfferId) {
      return woodOrderList?.filter((it) => it.SamOfferId === samOfferId) ?? [];
    }
    return woodOrderList;
  };

  return (
    <>
      <Box
        aria-label="Wood Order"
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: `0 -12px 24px -4px rgba(145, 158, 171, 0.12)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '24px',
          }}
        >
          <Typography variant="h6" color={'text.primary'}>
            {t('WOOD_ORDERS')}
          </Typography>
          {showEditMode && (
            <Button
              disabled={isSoReadOnly || completionStatus}
              variant="outlined"
              color="primary"
              onClick={() => {
                handleUpsertModal('open');
              }}
            >
              {t('ADD_NEW_ITEM')}
            </Button>
          )}
        </Box>

        <WoodOrderTable
          data={getWoodOrderListForTable()}
          isLoading={isLoading}
          selectedWoodOrderID={selectedWoodOrderID}
          setSelectedWoodOrderID={setSelectedWoodOrderID}
          setSelectedWoodOrderDetails={setSelectedWoodOrderDetails}
          onEditModalSubmit={editWoodOrderItem}
          onDeletion={deleteWoodOrderItem}
          onCopyPasteClick={copyPasteWoodOrderDetails}
          completionStatus={completionStatus}
          showEditMode={showEditMode}
          samOfferUId={samOfferUId}
          samOfferId={samOfferId}
        />
      </Box>

      {openAddModal && (
        <UpsertWoodItem
          type={'add'}
          onClose={handleUpsertModal}
          onSubmitForm={addWoodOrderItem}
          samOfferUId={samOfferUId}
          samOfferId={samOfferId}
        />
      )}
    </>
  );
};

export default WoodOrder;
