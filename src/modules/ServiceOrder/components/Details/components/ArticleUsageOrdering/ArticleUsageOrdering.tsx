import { useTranslation } from 'react-i18next';
import ArticleUsageOrderingTable from './components/ArticleUsageOrderingTable/ArticleUsageOrderingTable';
import { Box, Button, Checkbox, Typography } from '@mui/material';
import { type TableData, type HeadCell } from '@/src/components/CustomTable/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect, useRef, useState } from 'react';
import ProductSearch from '../ProductSearch/ProductSearch';
import AddEditArticleUsageOrdering from './components/AddEditArticleUsageOrdering/AddEditArticleUsageOrdering';
import { v4 as uuidv4 } from 'uuid';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import { type UsersSamOrder } from '@/src/hooks/useTourData/tourData.interface';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';
import { useSelector } from '@/src/redux/store';
import useStepperModal from '@/src/hooks/useStepperModal/useStepperModal';
import type { CurrentUserRightToFrontendAll } from '@/src/hooks/useMasterData/masterData.interface';

const Modals = {
  ProductSearch: 'productSearch',
  AddEditArticleUsageOrdering: 'addEditArticleUsageOrdering',
} as const;

const ArticleUsageOrdering = () => {
  const { t } = useTranslation('index');
  const id = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const {
    dataList: allArticleUsageOrderingData,
    getDataList: getAllArticleUsageOrderingData,
    filteredDataList: articleUsageOrderingData,
    getFilteredDataList: getArticleUsageOrdering,
    updateDataList: updateArticleUsageOrdering,
    isLoading,
  } = useIndexedDbData<UsersSamOrder>('TourPlanData', 'UsersSamOrders');

  const [activeProductRow, setActiveProductRow] = useState<TableData | undefined>(undefined);
  const [currentModal, setCurrentModal] = useState<ModalDetails | null>(null);
  const [showAllSourceStocksStatus, setShowAllSourceStocksStatus] = useState(false);
  const addEditArticleUsageOrderingRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const stepLabels = [t('PRODUCT_SEARCH'), t('ADD_ARTICLE_USAGE_ORDERING')];

  const { getStepDetails, goToNextStep, goToPreviousStep, resetAllSteps } =
    useStepperModal(stepLabels);

  useEffect(() => {
    if (id) {
      getAllArticleUsageOrderingData().then();
      getArticleUsageOrdering('OrderId', Number(id)).then();
    }
  }, [id]);

  const {
    filteredDataList: currentUserRightToFrontendAll,
    getFilteredDataList: getCurrentUserRightToFrontendAll,
  } = useIndexedDbData<CurrentUserRightToFrontendAll>(
    'MasterData',
    'CurrentUserRightToFrontendAlls'
  );

  useEffect(() => {
    getCurrentUserRightToFrontendAll('RightToFrontendUser', '229').then();
  }, []);

  useEffect(() => {
    setShowAllSourceStocksStatus(currentUserRightToFrontendAll.length > 0);
  }, [currentUserRightToFrontendAll]);

  const tableHeaders: HeadCell[] = [
    { id: 'sWGA', label: t('S_WGA'), sortable: false },
    { id: 'anz', label: t('ANZ'), sortable: true },
    { id: 'articleNo', label: t('ARTICLE_NO'), sortable: true },
    { id: 'articleDescription', label: t('ARTICLE_DESCRIPTION'), sortable: true },
    { id: 'grossIncl', label: t('GROSS_INCL'), align: 'right', sortable: true },
    { id: 'grossExcl', label: t('GROSS_EXCL'), align: 'right', sortable: true },
    { id: 'fEASExcl', label: t('FEA_S_EXCL'), align: 'right', sortable: true },
    { id: 'sourceStock', label: t('SOURCE_STOCK'), sortable: false },
    { id: 'ver', label: t('IS_USED'), align: 'center', sortable: false },
    { id: 'objective', label: t('OBJECTIVE'), sortable: true },
    { id: 'productID', label: t('PRODUCT_ID'), sortable: true },
    { id: 'bc', label: t('BC'), align: 'center', sortable: false },
    { id: 'set', label: t('SET'), sortable: false },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];

  const callUpdate = async (
    allData: UsersSamOrder[],
    updatedData: UsersSamOrder,
    actionType: IActionType
  ) => {
    await updateArticleUsageOrdering(
      allData,
      updatedData,
      actionType,
      'UsersSamOrdersUpdateRequestModel'
    );
    getArticleUsageOrdering('OrderId', Number(id));
  };

  const handleAddModalSubmit = async (formData: UsersSamOrder, duplicate: boolean = false) => {
    if (!duplicate && allArticleUsageOrderingData) {
      const updatedData = [...allArticleUsageOrderingData, formData];
      callUpdate(updatedData, formData, 'InsertRecords');
      setActiveProductRow(undefined);
      goToPreviousStep();
      setCurrentModal(null);
    }
    if (duplicate && allArticleUsageOrderingData) {
      const newDataToAdd = {
        ...formData,
        UId: uuidv4(),
      };
      const updatedData = [...allArticleUsageOrderingData, newDataToAdd];

      callUpdate(updatedData, newDataToAdd, 'InsertRecords');
    }
  };

  const handleDataDeletion = async (data: UsersSamOrder) => {
    const updatedData = allArticleUsageOrderingData.filter((item) => item.UId !== data.UId);
    callUpdate(updatedData, data, 'DeleteRecords');
  };

  const handleEditModalSubmit = async (formData: UsersSamOrder) => {
    const updatedData = allArticleUsageOrderingData.map((data) => {
      if (data.UId === formData.UId) {
        return formData;
      }
      return data;
    });

    callUpdate(updatedData, formData, 'UpdateRecords');
  };

  const handleProductRowClick = (row: TableData) => {
    setActiveProductRow(row);
    goToNextStep();
    setCurrentModal(modalAddEditArticleUsageOrdering);
  };

  const modalProductSearch: ModalDetails = {
    name: Modals.ProductSearch,
    title: t('PRODUCT_SEARCH'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: () => {
          setCurrentModal(null);
        },
        variant: 'outlined',
      },
    ],
  };

  const modalAddEditArticleUsageOrdering: ModalDetails = {
    name: Modals.AddEditArticleUsageOrdering,
    title: t('ADD_ARTICLE_USAGE_ORDERING'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: () => {
          resetAllSteps();
          setCurrentModal(null);
        },
        variant: 'outlined',
      },
      {
        label: t('BACK'),
        onClick: () => {
          setActiveProductRow(undefined);
          goToPreviousStep();
          setCurrentModal(modalProductSearch);
        },
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          addEditArticleUsageOrderingRef.current?.handleSubmitForm();
        },
      },
    ],
  };

  const getModalActions = () => {
    switch (currentModal?.name) {
      case Modals.AddEditArticleUsageOrdering:
        return modalAddEditArticleUsageOrdering.actions;
      case Modals.ProductSearch:
      default:
        return modalProductSearch.actions;
    }
  };

  return (
    <>
      <Box
        aria-label="Article Usage Ordering"
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '24px 24px 16px 24px' }}>
          <Typography variant="h6" color={'text.primary'}>
            {t('ARTICLE_USAGE_ORDERING')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Checkbox
              onChange={() => {
                setShowAllSourceStocksStatus((prevStatus) => !prevStatus);
              }}
              checked={showAllSourceStocksStatus}
              disabled={currentUserRightToFrontendAll.length === 0}
            />
            <Typography variant="body2" color="text.primary" ml={-2}>
              {t('SHOW_ALL_WGA_IN_SOURCE_STOCK')}
            </Typography>
            <Button
              disabled={isSoReadOnly}
              variant="outlined"
              color="primary"
              onClick={() => {
                setCurrentModal(modalProductSearch);
              }}
            >
              {t('ADD_NEW_ITEM')}
            </Button>
          </Box>
        </Box>
        <ArticleUsageOrderingTable
          data={articleUsageOrderingData as unknown as TableData[]}
          headCells={tableHeaders}
          isLoading={isLoading}
          onEditModalSubmit={handleEditModalSubmit}
          onCopyRow={handleAddModalSubmit}
          onDeletion={handleDataDeletion}
          showAllSourceStocks={showAllSourceStocksStatus}
        />
      </Box>

      {currentModal && (
        <CustomModal
          open
          onClose={() => {
            setCurrentModal(null);
          }}
          title={currentModal.title}
          actions={
            <CustomModalActions actions={getModalActions()} stepDetails={getStepDetails()} />
          }
          aria-label={currentModal.name}
        >
          {currentModal.name === Modals.ProductSearch && (
            <ProductSearch onProductRowClick={handleProductRowClick} type={'article'} />
          )}

          {currentModal.name === Modals.AddEditArticleUsageOrdering && (
            <AddEditArticleUsageOrdering
              ref={addEditArticleUsageOrderingRef}
              onSubmitForm={handleAddModalSubmit}
              type="add"
              data={activeProductRow}
              showAllSourceStocks={showAllSourceStocksStatus}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export default ArticleUsageOrdering;
