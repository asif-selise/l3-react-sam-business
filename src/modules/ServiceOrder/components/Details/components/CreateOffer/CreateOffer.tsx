import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import NewOrder from './components/NewOrder/NewOrder';
import ItemList from './components/ItemList/ItemList';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

import type {
  SamOffer,
  SamOfferDetail,
  SamOfferProductDetail,
  ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import {
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
  type SamOfferProperty, // tSamNoEigenschaft
  type SamOfferTypeProperty, // tSamNoTyp_Eigenschaft
  type Manufacturer,
  type SamOfferProduct,
  type QrptCurrentDefaultSettings,
} from '@/src/hooks/useMasterData/masterData.interface';
import OfferForm from './components/OfferForm/OfferForm';
import AdditionalCosts from './components/AdditionalCosts/AdditionalCosts';
import { type GetDetailGridDataParams } from './Interfaces/ParamsInterfaces/GetDetailGridDataParams';
import { getDetailGridData } from './Services/GetDetailGridDataService';
import { type GetTableDataParams } from './Interfaces/ParamsInterfaces/GetTableDataParams';
import { getTableData } from './Services/GetTableDataService';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';
import { type IStep } from '../Offer/Offer';
import { type GridEditControl } from './types';
import { useSelector } from '@/src/redux/store';
import { getGeraet } from './Services/GetGeraetService';
import { type IDetail } from './Interfaces/IDetail';
import { type GeraetGrupe } from './Interfaces/GeraetGrupe';
import { type DetailGridData } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/DetailGridData';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import useStepperModal from '@/src/hooks/useStepperModal/useStepperModal';
import { isDefined } from '@/src/helpers/genericFunctions';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';

export type operationType = 'add' | 'edit';

interface Props {
  open: boolean;
  samOfferId: number;
  currentStep: IStep;
  samOfferUId: string;
  isNewSamOffer: boolean;
  isCopy: boolean;
  samOfferCopyId: number | null;
  samOfferCopyUId: string | null;
  type: operationType;
  setCurrentStep: Dispatch<SetStateAction<IStep>>;
  onCancel: (action: 'save' | 'discard') => void;
}

const CreateOffer = ({
  open,
  onCancel,
  samOfferUId,
  samOfferId,
  isNewSamOffer,
  isCopy,
  samOfferCopyId,
  samOfferCopyUId,
  currentStep,
  setCurrentStep,
  type,
}: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const offerDimensionRef = useRef<{ handleSubmitForm: () => void } | null>(null);
  const offerFormRef = useRef<{ handleSubmitForm: () => void } | null>(null);
  const AdditionalCostsRef = useRef<{ handleSubmitForm: () => void } | null>(null);
  const serviceOrderId = useSelector((state) => state.serviceOrder.id);
  const { data: technicianData } = useTechnicianData();
  const stepLabels = [
    t('OFFER_TYPE'),
    t('OFFER_DETAILS'),
    t('DEVICE_SELECTION'),
    t('ADDITIONAL_COSTS'),
  ];
  const { getStepDetails, goToNextStep, goToPreviousStep } = useStepperModal(stepLabels);

  const [tableData, setTableData] = useState<GridEditControl[] | null>(null);
  const [detailDataGrid, setDetailDataGrid] = useState<DetailGridData | null>(null);
  const [detailProducts, setDetailProducts] = useState<SamOfferProductDetail[] | null>(null);
  const [geraetDetails, setGeraetDetails] = useState<GeraetGrupe | null>(null);
  const [detailItemsByCreation, setDetailItemsByCreation] = useState<IDetail[] | []>([]);
  const [activeLoader, setActiveLoader] = useState<boolean>(false);
  const [newOfferData, setNewOfferData] = useState<Partial<SamOffer> | null>(null);
  const [selectedSamOfferType, setSelectedSamOfferType] = useState<number | null>(null);
  const [blocker, setBlocker] = useState<string>('');

  // #region [Get data]
  // tSamNo
  const {
    dataItem: samOffer,
    getDataItem: getSamOffer,
    dataList: samOfferDataList,
    getDataList: getSamOfferDataList,
    updateDataList: updateSamOffers,
    isLoading: samOfferLoading,
  } = useIndexedDbData<SamOffer>('TourPlanData', 'SamOffers');

  // tSamNoDetail
  const {
    dataList: allSamOfferDetails,
    getDataList: getSamOfferDetails,
    updateDataList: updateSamOfferDetails,
    isLoading: SamOfferDetailLoading,
  } = useIndexedDbData<SamOfferDetail>('TourPlanData', 'SamOfferDetails');

  // tSamNoDetailProdukt
  const {
    dataList: samOfferProductDetails,
    getDataList: getSamOfferProductDetails,
    updateDataList: updateSamOfferProductDetails,
    isLoading: samOfferProductDetailsLoading,
  } = useIndexedDbData<SamOfferProductDetail>('TourPlanData', 'SamOfferProductDetails');

  // tSamNoProdukt
  const {
    dataList: samOfferProducts,
    getDataList: getSamOfferProducts,
    isLoading: samOfferProductsLoading,
  } = useIndexedDbData<SamOfferProduct>('MasterData', 'SamOfferProducts');

  // tAuftrag
  const { dataItem: serviceOrderDetail, getDataItem: getServiceOrderDetail } =
    useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  // tHersteller
  const {
    dataList: manufacturers,
    getDataList: getManufacturers,
    isLoading: manufacturerLoading,
  } = useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

  // tSamNoAltgeraetText
  const {
    dataList: samOfferOldDeviceTexts,
    getDataList: getSamOfferOldDeviceTexts,
    isLoading: samOfferOldDeviceTextsLoading,
  } = useIndexedDbData<SamOfferOldDeviceText>('MasterData', 'SamOfferOldDeviceTexts');

  // tSamNoEigenschaft
  const {
    dataList: samOfferProperties,
    getDataList: getSamOfferProperties,
    isLoading: samOfferPropertiesLoading,
  } = useIndexedDbData<SamOfferProperty>('MasterData', 'SamOfferProperties');

  // tSamNoTyp_Eigenschaft
  const {
    dataList: samOfferTypeProperties,
    getDataList: getSamOfferTypeProperties,
    isLoading: samOfferTypePropertiesLoading,
  } = useIndexedDbData<SamOfferTypeProperty>('MasterData', 'SamOfferTypeProperties');

  // tSamNoNeugeraetText
  const {
    dataList: samOfferNewDeviceTexts,
    getDataList: getSamOfferNewDeviceTexts,
    isLoading: samOfferNewDeviceTextsLoading,
  } = useIndexedDbData<SamOfferNewDeviceText>('MasterData', 'SamOfferNewDeviceTexts');

  const {
    dataList: qrptCurrentDefaultSettingsDataList,
    getDataList: getQrptCurrentDefaultSettings,
    isLoading: qrptCurrentDefaultSettingsDataLoading,
  } = useIndexedDbData<QrptCurrentDefaultSettings>('MasterData', 'QrptCurrentDefaultSettings');

  const saveStepData = async (data: Partial<SamOffer>) => {
    if (blocker) {
      return dispatch(showErrorMessage(blocker));
    }

    const updatedData = { ...newOfferData, ...data };
    setNewOfferData(updatedData);
    handleNextStep(updatedData);
  };

  const closeModal = (type: 'save' | 'discard' = 'discard') => {
    setNewOfferData(null);
    setSelectedSamOfferType(null);

    if (type === 'discard') {
      onCancel(type);
    }
    if (type === 'save') {
      setTimeout(() => {
        setActiveLoader(false);
        onCancel(type);
      }, 500);
    }
  };

  const handleSameOffersUpdate = async (
    dataList: Array<Partial<SamOffer>>,
    data: Partial<SamOffer>,
    recordType: 'InsertRecords' | 'UpdateRecords'
  ) => {
    await updateSamOffers(
      dataList as unknown as SamOffer[],
      data,
      recordType,
      'SamOffersUpdateRequestModel'
    );
  };

  const getNewOfferDetailsData = () => {
    const structuredData: SamOfferDetail[] = [];
    if (tableData) {
      for (let i = 0; i < (tableData?.length ?? 0); i++) {
        const item = tableData[i];
        const mappedItem: SamOfferDetail = {
          UId: item.OldDeviceAnswer?.DataContext?.UId ?? '',
          SortOrder: item.OldDeviceAnswer?.DataContext?.SortOrder ?? null,
          DetailId: item.OldDeviceAnswer?.DataContext?.DetailId ?? -1,
          SamOfferUId: isCopy ? samOfferCopyUId ?? '' : samOfferUId,
          SamOfferId: isCopy ? samOfferCopyId ?? 0 : samOfferId,
          SamOfferProperty: item.ControlRow?.GridRow.detailItem.SamOfferProperty ?? 0,
          OldDevice: item.OldDeviceAnswer?.Text ?? null,
          NewDevice: item.NewDeviceAdditional?.Text ?? null,
          GrossExcl: item.GrossExcl?.Text ? Number(item.GrossExcl.Text) : null,
          ModifiedOnDetail: new Date().toISOString(),
          ModifiedByDetail: technicianData?.systemUser ?? null,
        };

        structuredData.push(mappedItem);
      }
    }
    return structuredData;
  };

  const handleSave = async (data: Partial<SamOffer>) => {
    if (type === 'add') {
      const newOffer = { ...data, UId: samOfferUId, isNewOffer: true };
      const updatedData = [...samOfferDataList, newOffer];

      await handleSameOffersUpdate(updatedData, newOffer, 'InsertRecords');
    }

    if (type === 'edit') {
      if (isCopy) {
        const newOffer = { ...data, UId: samOfferCopyUId ?? '', SamOfferId: samOfferCopyId ?? 0 };
        const updatedData = [...samOfferDataList, newOffer];

        await handleSameOffersUpdate(updatedData, newOffer, 'InsertRecords');
      } else {
        const updateSamOffers = samOfferDataList.map((item) =>
          item.UId === data.UId ? data : item
        );

        await handleSameOffersUpdate(updateSamOffers, data, 'UpdateRecords');
      }
    }

    const newOfferDetailsData = getNewOfferDetailsData();
    const newDetailProducts = isDefined(detailProducts) ? structuredClone(detailProducts) : [];

    if (isCopy) {
      for (const samOfferDetail of newOfferDetailsData) {
        const newDetailId = getUniqueNumber();

        for (const samOfferDetailProduct of newDetailProducts) {
          if (samOfferDetailProduct.SamOfferDetailId === samOfferDetail.DetailId) {
            samOfferDetailProduct.UId = getUniqueID();
            samOfferDetailProduct.SamOfferUId = samOfferCopyUId ?? '';
            samOfferDetailProduct.SamOfferDetailId = newDetailId;
            samOfferDetailProduct.SamOfferDetailUId = samOfferDetail.UId;
            samOfferDetailProduct.SamOfferProductDetailId = getUniqueNumber();
          }
        }

        samOfferDetail.DetailId = newDetailId;
      }
    }

    const updatedType = isCopy ? 'copy' : type;

    if (newOfferDetailsData && newOfferDetailsData?.length > 0) {
      let updatedSamOfferDetails = allSamOfferDetails;

      switch (updatedType) {
        case 'add':
        case 'copy':
          updatedSamOfferDetails = updatedSamOfferDetails.concat(newOfferDetailsData);

          await updateSamOfferDetails(
            updatedSamOfferDetails,
            newOfferDetailsData,
            'InsertRecords',
            'SamOfferDetailsUpdateRequestModel'
          );

          break;

        case 'edit':
          updatedSamOfferDetails = updatedSamOfferDetails.map((it) => {
            const item = newOfferDetailsData.find(
              (x) => x.DetailId === it.DetailId && x.SamOfferId === it.SamOfferId
            );

            if (!item) {
              return it;
            }

            return item;
          });

          await updateSamOfferDetails(
            updatedSamOfferDetails,
            newOfferDetailsData,
            'UpdateRecords',
            'SamOfferDetailsUpdateRequestModel'
          );
      }
    }

    if (isDefined(newDetailProducts)) {
      let updatedSamOfferProductDetails = samOfferProductDetails;
      const updatedDetailProducts: SamOfferProductDetail[] = [];
      const insertedDetailProducts: SamOfferProductDetail[] = [];

      switch (updatedType) {
        case 'add':
        case 'copy':
          for (const item of newDetailProducts) {
            item.SamOfferUId = isCopy ? samOfferCopyUId ?? '' : samOfferUId;
          }

          updatedSamOfferProductDetails = updatedSamOfferProductDetails.concat(newDetailProducts);

          await updateSamOfferProductDetails(
            updatedSamOfferProductDetails,
            newDetailProducts,
            'InsertRecords',
            'SamOfferProductDetailsUpdateRequestModel'
          );

          break;
        case 'edit':
          // update part
          for (const detailProduct of newDetailProducts) {
            let found = false;
            for (const updatedDetailProduct of updatedSamOfferProductDetails) {
              if (detailProduct.SamOfferDetailId === updatedDetailProduct.SamOfferDetailId) {
                updatedDetailProduct.Quantity = detailProduct.Quantity;
                found = true;
              }
            }
            if (found) {
              updatedDetailProducts.push(detailProduct);
            }
          }

          await updateSamOfferProductDetails(
            updatedSamOfferProductDetails,
            updatedDetailProducts,
            'UpdateRecords',
            'SamOfferProductDetailsUpdateRequestModel'
          );

          // inserted part
          for (const detailProduct of newDetailProducts) {
            let found = false;
            for (const updatedDetailProduct of updatedSamOfferProductDetails) {
              if (detailProduct.SamOfferDetailId === updatedDetailProduct.SamOfferDetailId) {
                found = true;
              }
            }
            if (!found) {
              insertedDetailProducts.push(detailProduct);
            }
          }

          if (insertedDetailProducts.length > 0) {
            updatedSamOfferProductDetails =
              updatedSamOfferProductDetails.concat(insertedDetailProducts);
            await updateSamOfferProductDetails(
              updatedSamOfferProductDetails,
              insertedDetailProducts,
              'InsertRecords',
              'SamOfferProductDetailsUpdateRequestModel'
            );
          }

          break;

        default:
      }
    }

    dispatch(
      showSuccessMessage(
        t(type === 'add' ? 'NEW_OFFER_CREATED_SUCCESSFULLY' : 'OFFER_UPDATED_SUCCESSFULLY')
      )
    );

    closeModal('save');
  };

  const handleNextStep = async (data?: Partial<SamOffer>) => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => (prevStep + 1) as IStep);
      goToNextStep();
    }
    if (currentStep === 4 && data) {
      setActiveLoader(true);
      await handleSave(data);
    }
  };

  const navigateBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => (prevStep - 1) as IStep);
      goToPreviousStep();
    }
  };

  useEffect(() => {
    if (samOfferId) {
      getSamOffer('SamOfferId', samOfferId).then();
    }
  }, [samOfferId]);

  useEffect(() => {
    if (isDefined(samOffer) && type === 'edit') {
      setSelectedSamOfferType(samOffer.SamOfferType);
      setNewOfferData(samOffer);
    }
  }, [samOffer]);

  useEffect(() => {
    if (serviceOrderId) {
      getServiceOrderDetail('OrderId', serviceOrderId).then();
    }
  }, [serviceOrderId]);

  useEffect(() => {
    getManufacturers().then();
    getSamOfferDetails().then();
    getSamOfferDataList().then();
    getSamOfferProducts().then();
    getSamOfferProperties().then();
    getSamOfferOldDeviceTexts().then();
    getSamOfferTypeProperties().then();
    getSamOfferNewDeviceTexts().then();
    getSamOfferProductDetails().then();
    getQrptCurrentDefaultSettings().then();
  }, []);

  // #region [Get geraetDetails, detailDataGrid]
  const getDetailGridDataParams: GetDetailGridDataParams = {
    IsNewSamOffer: isNewSamOffer,
    OrderId: serviceOrderId,
    SamOfferId: samOfferId,
    SamOfferType: samOffer?.SamOfferType ?? newOfferData?.SamOfferType ?? -1,
    ServiceOrderDetail: serviceOrderDetail,
    Manufacturers: manufacturers,
    SamOfferTypeProperties: samOfferTypeProperties,
    SamOffer: samOffer,
    AllSamOfferDetails: allSamOfferDetails,
    SamOfferProductDetails: samOfferProductDetails,
    GeraetDetails: geraetDetails,
    SetDetailItemsByCreation: setDetailItemsByCreation,
    SetDetailProducts: setDetailProducts,
  };

  const fetchDetailGridData = async () => {
    if (newOfferData && isDefined(newOfferData?.SamOfferType)) {
      setGeraetDetails(getGeraet(newOfferData.SamOfferType));
      setActiveLoader(true);
      const dataGrid = await getDetailGridData(getDetailGridDataParams);
      setActiveLoader(false);
      setDetailDataGrid(dataGrid);
    }
  };

  useEffect(() => {
    fetchDetailGridData().then();
  }, [newOfferData]);

  // #endregion

  // #region [Get tableData]
  const getTableDataParams: GetTableDataParams = {
    IsNewSamOffer: isNewSamOffer,
    OrderId: serviceOrderId,
    SamOfferId: samOfferId,
    SamOfferType: samOffer?.SamOfferType ?? newOfferData?.SamOfferType ?? -1,
    ServiceOrderDetail: serviceOrderDetail,
    Manufacturers: manufacturers,
    SamOfferTypeProperties: samOfferTypeProperties,
    SamOfferProperties: samOfferProperties,
    SamOfferProducts: samOfferProducts,
    SamOfferOldDeviceTexts: samOfferOldDeviceTexts,
    SamOfferNewDeviceTexts: samOfferNewDeviceTexts,
    GeraetDetails: geraetDetails,
    SetGeraetDetails: setGeraetDetails,
    DetailItems: detailItemsByCreation,
    SetDetailItemsByCreation: setDetailItemsByCreation,
    SystemUser: technicianData?.systemUser ?? '',
  };

  const fetchTableData = async () => {
    setActiveLoader(true);
    const { data, error } = await getTableData(getTableDataParams);
    setActiveLoader(false);
    if (error) {
      setBlocker(error);
    }
    if (!error) {
      setTableData(data);
    }
  };

  useEffect(() => {
    if (
      isDefined(detailDataGrid) &&
      isDefined(detailItemsByCreation) &&
      isDefined(newOfferData?.SamOfferType)
    ) {
      fetchTableData();
    }
  }, [detailDataGrid, detailItemsByCreation, newOfferData]);

  // #endregion

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            closeModal('discard');
          },
          variant: 'outlined' as const,
        },
        ...(currentStep > 1
          ? [
              {
                label: t('BACK'),
                onClick: navigateBack,
                variant: 'outlined' as const,
              },
            ]
          : []),
        {
          label: currentStep === 4 ? t('SAVE') : t('NEXT'),
          onClick:
            currentStep === 1
              ? () => offerDimensionRef.current?.handleSubmitForm()
              : currentStep === 2
                ? () => offerFormRef.current?.handleSubmitForm()
                : currentStep === 4
                  ? () => AdditionalCostsRef.current?.handleSubmitForm()
                  : handleNextStep,
          variant: 'contained' as const,
        },
      ]}
      stepDetails={getStepDetails()}
    />
  );

  return (
    <CustomModal
      title={type === 'add' ? t('NEW_OFFER') : t('EDIT_OFFER')}
      open={open}
      onClose={() => {
        closeModal('discard');
      }}
      actions={modalActions}
    >
      {(activeLoader ||
        samOfferLoading ||
        SamOfferDetailLoading ||
        samOfferProductDetailsLoading ||
        samOfferProductsLoading ||
        manufacturerLoading ||
        samOfferOldDeviceTextsLoading ||
        samOfferPropertiesLoading ||
        samOfferTypePropertiesLoading ||
        samOfferNewDeviceTextsLoading ||
        qrptCurrentDefaultSettingsDataLoading) && <LoaderOverlay />}

      {(() => {
        switch (currentStep) {
          case 1:
            return (
              <NewOrder
                type={type}
                ref={offerDimensionRef}
                saveStepData={saveStepData}
                newOfferData={newOfferData}
                selectedSamOfferType={selectedSamOfferType}
                setSelectedSamOfferType={setSelectedSamOfferType}
              />
            );
          case 2:
            return (
              <OfferForm
                type={type}
                ref={offerFormRef}
                newOfferData={newOfferData}
                offerType={selectedSamOfferType as unknown as number}
                saveStepData={saveStepData}
                samOfferUId={samOfferUId}
                samOfferId={samOfferId}
                detailProducts={detailProducts ?? []}
                setActiveLoader={setActiveLoader}
              />
            );
          case 3:
            return (
              <ItemList
                listData={tableData ?? []}
                setListData={setTableData}
                manufacturers={manufacturers}
                samOfferProducts={samOfferProducts}
                geraetDetails={geraetDetails}
                detailProducts={detailProducts}
                setDetailProducts={setDetailProducts}
                setGeraetDetails={setGeraetDetails}
                detailItemsByCreation={detailItemsByCreation}
                samOfferNewDeviceTexts={samOfferNewDeviceTexts}
                samOfferOldDeviceTexts={samOfferOldDeviceTexts}
                setActiveLoader={setActiveLoader}
                activeLoader={activeLoader}
              />
            );
          case 4:
            return (
              <AdditionalCosts
                type={type}
                ref={AdditionalCostsRef}
                newOfferData={newOfferData}
                saveStepData={saveStepData}
                vatRate={qrptCurrentDefaultSettingsDataList[0].Vat}
              />
            );
          default:
            return null;
        }
      })()}
    </CustomModal>
  );
};
export default CreateOffer;
