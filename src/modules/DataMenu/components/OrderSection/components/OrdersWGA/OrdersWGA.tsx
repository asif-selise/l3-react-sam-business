import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import OrdersWGATable from './components/OrdersWGATable/OrdersWGATable';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { type IOrdersWGAData } from './components/OrdersWGATable/interfaces';
import { getData } from '@/indexedDb';
import { type TableData } from '@/src/components/CustomTable/types';
import ProductSearch from '@/src/modules/ServiceOrder/components/Details/components/ProductSearch/ProductSearch';
import { type Products } from '@/src/hooks/useMasterData/masterData.interface';
import { set } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueNumber } from '@/src/helpers/generateID';

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export type View = 'view' | 'selectProduct' | 'numberOfProduct';

const OrdersWGA = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState<View>('view');
  const [selectedProduct, setSelectedProduct] = useState<Products>();
  const [numberOfProduct, setNumberOfProduct] = useState<number | null>(null);

  const handleProductSelection = (row: TableData) => {
    setSelectedProduct(row as unknown as Products);
    setCurrentView('numberOfProduct');
  };

  const handleModalClose = () => {
    onClose(false);
  };

  const handleModalClick = () => {
    currentView === 'view'
      ? handleModalClose()
      : currentView === 'selectProduct'
        ? setCurrentView('view')
        : setCurrentView('selectProduct');
  };

  const setUpdateAPIData = async (updatedData: IOrdersWGAData) => {
    const allUpdatedData = await getData('UpdatedData');
    allUpdatedData.SamOrderWgaUploadOnlyUpdateRequestModel.InsertRecords.push(updatedData);
    await set('UpdatedData', JSON.stringify(allUpdatedData));
  };

  const setOrdersWGAData = async (updatedData: IOrdersWGAData) => {
    const ordersWGAIndexDbData = await getData('OrdersWGAData');
    ordersWGAIndexDbData.data.push(updatedData);
    await set('OrdersWGAData', JSON.stringify(ordersWGAIndexDbData));
  };

  const addOrderWGA = async () => {
    if (!numberOfProduct || numberOfProduct < 0 || numberOfProduct > 999) {
      return dispatch(showErrorMessage(t('ENTER_A_VALID_NUMBER')));
    }
    if (!selectedProduct) return dispatch(showErrorMessage(t('SELECT_A_PRODUCT')));

    if (!!selectedProduct && !!numberOfProduct) {
      const updatedOrderWGAData = {
        UId: uuidv4(),
        SamOrderWgaUploadOnlyId: getUniqueNumber(),
        ProductId: selectedProduct.ProductId,
        Quantity: numberOfProduct,
        ArticleNumber: selectedProduct.ManufacturerArticleNumber,
        ProductText: selectedProduct.Description,
        IsSynchronizing: false,
      };

      await setUpdateAPIData(updatedOrderWGAData as IOrdersWGAData);
      await setOrdersWGAData(updatedOrderWGAData as IOrdersWGAData);

      dispatch(showSuccessMessage(t('NEW_ORDER_ADDED')));
      setNumberOfProduct(null);
      setCurrentView('view');
    }
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          variant: 'outlined',
          onClick: handleModalClose,
        },
        ...(currentView !== 'view'
          ? [
              {
                label: t('BACK'),
                variant: 'outlined',
                onClick: handleModalClick,
              } as any,
            ]
          : []),
        ...(currentView === 'numberOfProduct'
          ? [
              {
                label: t('SAVE'),
                onClick: addOrderWGA,
              },
            ]
          : []),
      ]}
    />
  );

  const renderContent = () => {
    switch (currentView) {
      case 'view':
        return <OrdersWGATable setCurrentView={setCurrentView} />;
      case 'selectProduct':
        return <ProductSearch onProductRowClick={handleProductSelection} type={'article'} />;
      case 'numberOfProduct':
        return (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <TextField
              fullWidth
              type="number"
              label={t('NUMBER_OF_PRODUCTS')}
              value={numberOfProduct ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setNumberOfProduct(null);
                } else {
                  const numericValue = Number(value);
                  if (!isNaN(numericValue)) {
                    setNumberOfProduct(numericValue);
                  } else {
                    dispatch(showErrorMessage(t('ENTER_A_VALID_NUMBER')));
                  }
                }
              }}
            />
          </Box>
        );
    }
  };

  return (
    <CustomModal
      open
      onClose={handleModalClose}
      title={
        currentView === 'view'
          ? t('ORDERS_WGA')
          : currentView === 'selectProduct'
            ? t('PRODUCT_SEARCH')
            : t('ENTER_NUMBER')
      }
      actions={modalActions}
      variant={currentView === 'numberOfProduct' ? 'sm' : 'md'}
    >
      {renderContent()}
    </CustomModal>
  );
};

export default OrdersWGA;
