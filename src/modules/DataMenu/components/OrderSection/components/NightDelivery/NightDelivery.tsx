import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Box, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NightDeliveryTable from './components/NightDeliveryTable/NightDeliveryTable';
import { useEffect, useRef, useState } from 'react';
import { type TableData } from '@/src/components/CustomTable/types';
import EsoOption from './components/EsoOption/EsoOption';
import CreateESO from '@/src/modules/Dashboard/components/ElectronicServiceOrder/components/CreateESO/CreateESO';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import createNewEsoData from '@/src/modules/Dashboard/components/ElectronicServiceOrder/utils/createNewEsoData';
import { type SamOrder, type WorkflowDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type CreateESOFields } from '@/src/modules/Dashboard/components/ElectronicServiceOrder/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import useGetPostOrderOrGoodsReceiptData from '@/src/hooks/useGetPostOrderOrGoodsReceiptData/useGetPostOrderOrGoodsReceiptData';
import {
  type NightDeliveryData,
  type NightDeliveryFilterParams,
} from '@/src/hooks/useGetPostOrderOrGoodsReceiptData/types';
import { getNonEmptyValueOrNull, getNumberOrNull } from '@/src/helpers/sanitizeData';
import useStepperModal from '@/src/hooks/useStepperModal/useStepperModal';
import EditNightDelivery from './components/EditNightDelivery/EditNightDelivery';
import { useDispatch } from '@/src/redux/store';
import { toUTCDateTime } from '@/src/helpers/formatDate';
import useUpdateSamOrder from '@/src/hooks/useUpdateSamOrder/useUpdateSamOrder.hook';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';

const Modals = {
  NightDelivery: 'nightDelivery',
  CreateEso: 'createEso',
} as const;

interface Props {
  onClose: () => void;
}

const NightDelivery = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const { data: technicianData } = useTechnicianData();
  const { submitUpdate: updateSamOrder, response: samOrderUpdateResponse } = useUpdateSamOrder();

  const [systemUser, setSystemUser] = useState<string>('');

  const orderNoRef = useRef<HTMLInputElement>(null);
  const manufacturerRef = useRef<HTMLInputElement>(null);
  const soRef = useRef<HTMLInputElement>(null);
  const articleNoRef = useRef<HTMLInputElement>(null);
  const articleRefRef = useRef<HTMLInputElement>(null);

  const createESORef = useRef<{ handleSubmitForm: () => void } | null>(null);
  const editNightDeliveryRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const [activeNightDelivery, setActiveNightDelivery] = useState<NightDeliveryData | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openEsoOption, setOpenEsoOption] = useState(false);
  const [newEsoRemarks, setNewEsoRemarks] = useState<string>('');

  const intialFilterData: NightDeliveryFilterParams = {
    TechnicianEmployeeNumber: getNumberOrNull(technicianData?.technicianEmployeeNumber),
    SamOrderId: null,
    ManufacturerName: null,
    ManufacturerArticleNumber: null,
    ProductDescription: null,
    OrderId: null,
  };

  const [filters, setFilters] = useState(intialFilterData);

  const {
    data: nightDeliveryData,
    isLoading,
    refetch: refetchPostOrderOrGoodsReceiptData,
  } = useGetPostOrderOrGoodsReceiptData(filters);

  const {
    dataList: esoList,
    getDataList: getEsoList,
    updateDataList: updateEsoList,
  } = useIndexedDbData<WorkflowDetail>('TourPlanData', 'WorkflowDetails');

  const stepLabels = [t('POST_GOODS_RECEIPTS_FOR_OVERNIGHT_DELIVERIES'), t('CREATE_ESO')];

  const { getStepDetails, goToNextStep, goToPreviousStep } = useStepperModal(stepLabels);

  useEffect(() => {
    if (technicianData) {
      setSystemUser(technicianData.systemUser);
      setFilters((prevFilters) => ({
        ...prevFilters,
        TechnicianEmployeeNumber: technicianData.technicianEmployeeNumber,
      }));
    }
  }, [technicianData]);

  useEffect(() => {
    getEsoList();
  }, []);

  const handleApplyFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      SamOrderId: getNumberOrNull(orderNoRef.current?.value),
      ManufacturerName: getNonEmptyValueOrNull(manufacturerRef.current?.value),
      ManufacturerArticleNumber: getNonEmptyValueOrNull(articleNoRef.current?.value),
      ProductDescription: getNonEmptyValueOrNull(articleRefRef.current?.value),
      OrderId: getNumberOrNull(soRef.current?.value),
    }));
  };

  const handleClearFilter = () => {
    setFilters(intialFilterData);

    orderNoRef.current && (orderNoRef.current.value = '');
    manufacturerRef.current && (manufacturerRef.current.value = '');
    soRef.current && (soRef.current.value = '');
    articleNoRef.current && (articleNoRef.current.value = '');
    articleRefRef.current && (articleRefRef.current.value = '');
  };

  const renderFilters = (
    <>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
          {t('FILTER')}
        </Button>

        <Button variant="outlined" color="primary" onClick={handleClearFilter}>
          {t('CLEAR')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          inputRef={orderNoRef}
          placeholder={t('Order No. (S7000)')}
          sx={{ width: '25%' }}
          size="small"
        />
        <TextField
          inputRef={manufacturerRef}
          placeholder={t('MANUFACTURER')}
          sx={{ width: '25%' }}
          size="small"
        />
        <TextField inputRef={soRef} placeholder={t('SO')} sx={{ width: '10%' }} size="small" />
        <TextField
          inputRef={articleNoRef}
          placeholder={t('ARTICLE_NO')}
          sx={{ width: '20%' }}
          size="small"
        />
        <TextField
          inputRef={articleRefRef}
          placeholder={t('Article Ref.')}
          sx={{ width: '20%' }}
          size="small"
        />
      </Box>
    </>
  );

  const modalNightDelivery: ModalDetails = {
    name: Modals.NightDelivery,
    title: t('POST_GOODS_RECEIPTS_FOR_OVERNIGHT_DELIVERIES'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
    ],
  };

  const [currentModal, setCurrentModal] = useState<ModalDetails>(modalNightDelivery);

  const modalCreateEso: ModalDetails = {
    name: Modals.CreateEso,
    title: t('CREATE_ESO'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: () => {
          goToPreviousStep();
          setCurrentModal(modalNightDelivery);
          setActiveNightDelivery(null);
        },
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          createESORef.current?.handleSubmitForm();
        },
      },
    ],
  };

  const handleCreateEsoModalSumit = (formData: CreateESOFields) => {
    setCurrentModal(modalNightDelivery);

    const newEsoData = createNewEsoData(formData, systemUser);

    updateEsoList(
      [...esoList, newEsoData as WorkflowDetail],
      newEsoData,
      'InsertRecords',
      'WorkflowDetailsUpdateRequestModel'
    );

    goToPreviousStep();
  };

  const handleRowEsoClick = (row: NightDeliveryData) => {
    setActiveNightDelivery(row);
    setOpenEsoOption(true);
  };

  const handleEditModalOpen = (row: NightDeliveryData) => {
    setActiveNightDelivery(row);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setActiveNightDelivery(null);
    setOpenEditModal(false);
  };

  const handleEditModalSave = async (data: NightDeliveryData) => {
    const mappedObject: SamOrder = {
      OrderedOn: data.OrderedDate ?? toUTCDateTime(String(new Date())) ?? '',
      SOId: data.SamOrderId,
      OrderId: data.OrderId ?? 0,
      ScheduledDate: data.AppointmentDate,
      ManufacturerNumber: String(data.ManufacturerId),
      ManufacturerName: data.ManufacturerName,
      ManufacturerArticleNumber: data.ManufacturerArticleNumber,
      ProductDescription: data.ProductDescription,
      ReceivedQuantity: data.DeliveredNumber,
      DeliveryNumber: data.DeliveryNumber,
      QuantityOrdered: data.OrderedQuantity,
      Booked: data.ReceivedQuantity !== 0,
      ListPriceExcludingTax: data.ListPriceExclTax ?? 0,
      ProductId: data.ProductId ?? 0,
      OrderDetailId: data.SamOrderDetailId ?? 0,
    };

    updateSamOrder({
      ...mappedObject,
      SystemUserWithoutDomain: systemUser,
      SyncDate: toUTCDateTime(String(new Date())) ?? '',
    });

    handleEditModalClose();
  };

  const getModalActions = () => {
    switch (currentModal.name) {
      case Modals.CreateEso:
        return modalCreateEso.actions;
      case Modals.NightDelivery:
      default:
        return modalNightDelivery.actions;
    }
  };

  const updateEsoRemarks = (newItemNo?: string) => {
    if (!activeNightDelivery) return;

    let remarksField = '';

    if (newItemNo) {
      remarksField = 'New Item No: ' + newItemNo + '\n';
    }

    remarksField += `Best. ID: ${activeNightDelivery.SamOrderId ?? ''}\nProduct ID: ${activeNightDelivery.ProductId ?? ''}\nProduct: ${activeNightDelivery.ManufacturerArticleNumber ?? ''} - ${activeNightDelivery.ProductDescription ?? ''}`;

    setNewEsoRemarks(remarksField);
  };

  const handleFollowUpItemSubmit = (newItemNo: string) => {
    setOpenEsoOption(false);
    updateEsoRemarks(newItemNo);
    goToNextStep();
    setCurrentModal(modalCreateEso);
  };

  const isKnownError = (error: string) => {
    return [
      'NEGATIVE_GOODS_CALCULATED',
      'NEGATIVE_GOODS_INPUT_NOT_ALLOWED',
      'INVALID_ORDER_DETAIL_ID',
      'ORDER_DETAIL_ID_ALREADY_BOOKED',
      'BOOKING_INCOMPLETE',
    ].includes(error);
  };

  useEffect(() => {
    if (samOrderUpdateResponse.isError && samOrderUpdateResponse.error) {
      if (isKnownError(samOrderUpdateResponse.error)) {
        dispatch(showErrorMessage(t(samOrderUpdateResponse.error)));
      } else {
        dispatch(showErrorMessage(samOrderUpdateResponse.error));
      }
    }
  }, [samOrderUpdateResponse.isError, samOrderUpdateResponse.error]);

  useEffect(() => {
    if (samOrderUpdateResponse.isSuccess && !samOrderUpdateResponse.error) {
      dispatch(showSuccessMessage(t('NIGHT_DELIVERY_UPDATED_SUCCESSFULLY')));
      refetchPostOrderOrGoodsReceiptData();
    }
  }, [samOrderUpdateResponse.isSuccess]);

  const editModalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            setCurrentModal(modalNightDelivery);
            setActiveNightDelivery(null);
            setOpenEditModal(false);
          },
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: () => {
            editNightDeliveryRef.current?.handleSubmitForm();
          },
          variant: 'contained',
        },
      ]}
    />
  );

  return (
    <>
      <CustomModal
        open
        onClose={openEditModal ? handleEditModalClose : onClose}
        title={openEditModal ? t('EDIT_NIGHT_DELIVERY') : currentModal.title}
        actions={
          openEditModal ? (
            editModalActions
          ) : (
            <CustomModalActions actions={getModalActions()} stepDetails={getStepDetails()} />
          )
        }
      >
        {samOrderUpdateResponse.isLoading && <LoaderOverlay />}
        {!openEditModal && currentModal.name === Modals.NightDelivery && (
          <>
            {renderFilters}
            <NightDeliveryTable
              data={(nightDeliveryData as unknown as TableData[]) ?? []}
              isLoading={isLoading}
              onEsoClick={handleRowEsoClick}
              onEditClick={handleEditModalOpen}
            />
          </>
        )}
        {!openEditModal && currentModal.name === Modals.CreateEso && (
          <CreateESO
            ref={createESORef}
            newEsoId={116}
            remarks={newEsoRemarks}
            onSubmitForm={handleCreateEsoModalSumit}
          />
        )}
        {openEditModal && activeNightDelivery && (
          <EditNightDelivery
            ref={editNightDeliveryRef}
            data={activeNightDelivery}
            onSave={handleEditModalSave}
          />
        )}
      </CustomModal>

      {openEsoOption && (
        <EsoOption
          onClose={() => {
            setOpenEsoOption(false);
          }}
          openEsoCreation={() => {
            setOpenEsoOption(false);
            updateEsoRemarks();
            goToNextStep();
            setCurrentModal(modalCreateEso);
          }}
          onFollowUpItemSubmitForm={handleFollowUpItemSubmit}
        />
      )}
    </>
  );
};

export default NightDelivery;
