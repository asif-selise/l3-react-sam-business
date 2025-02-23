import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductDetails from './components/ProductDetails/ProductDetails';
import MaterialTable from './components/MaterialTable/MaterialTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type TableData } from '@/src/components/CustomTable/types';
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import CostCalculation from './components/CostCalculation/CostCalculation';
import { type SamKv, type SamKvDetail } from '@/src/hooks/useTourData/tourData.interface';
import {
  type QrptCurrentDefaultSettings,
  type TempTechnician,
} from '@/src/hooks/useMasterData/masterData.interface';
import useReadOnly from '@/src/hooks/useReadOnly/useReadOnly.hook';
import { useDispatch, useSelector } from '@/src/redux/store';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import ProductSearch from '../components/ProductSearch/ProductSearch';
import AddEditMaterial from './components/AddEditMaterial/AddEditMaterial';
import dayjs from 'dayjs';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import useSamKvDetailsFromInvoiceDetails from './utils/useSamKvDetailsFromInvoiceDetails';
import { updateKvStatus } from '@/src/slices/kvStatusSlice/kvStatus.slice';
import { getNumberOrNull, getStringOrNull } from '@/src/helpers/sanitizeData';

const Modals = {
  KV: 'kv',
  ProductSearch: 'productSearch',
  AddEditMaterial: 'addEditMaterial',
} as const;

interface Props {
  isItNewKv: boolean;
  setIsItNewKv: Dispatch<SetStateAction<boolean>>;
  soRep: number; // _qcptBeiKVNONeu
  onClose: () => void;
}

const KVEstimatedCost = ({ isItNewKv, setIsItNewKv, soRep, onClose }: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state) => state.serviceOrder.id);
  const { data: technicianData } = useTechnicianData();
  const dispatch = useDispatch();

  const [kvData, setKvData] = useState<SamKv | null>();
  const [materialsData, setMaterialsData] = useState<SamKvDetail[]>([]);
  const [materialSaveType, setMaterialSaveType] = useState<'add' | 'edit'>();

  const { getSamKvDetailsFromInvoiceDetails } = useSamKvDetailsFromInvoiceDetails(id);

  const {
    dataList: materialsDataList,
    getDataList: getMaterials,
    updateDataLists: updateMaterials,
    updateDataList: updateMaterialsList,
    isLoading,
  } = useIndexedDbData<SamKvDetail>('TourPlanData', 'SamKvDetails');

  const {
    dataList: kvDataList,
    getDataList: getKvs,
    updateDataList: updateKvList,
  } = useIndexedDbData<SamKv>('TourPlanData', 'SamKvs');

  const {
    dataList: qrptCurrentDefaultSettingsDataList,
    getDataList: getQrptCurrentDefaultSettings,
  } = useIndexedDbData<QrptCurrentDefaultSettings>('MasterData', 'QrptCurrentDefaultSettings');

  const { dataItem: TechnicianData, getDataItem: getTechnician } = useIndexedDbData<TempTechnician>(
    'MasterData',
    'TempTechnicians'
  );

  const { readOnly, setReadOnly, workflowDetailData, currentUserRightToFrontendAllsData } =
    useReadOnly();

  const [readOnlyMsg, setReadOnlyMsg] = useState<string>();

  const costCalculationRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  useEffect(() => {
    getKvs();
    getMaterials();
    getQrptCurrentDefaultSettings();
  }, []);

  useEffect(() => {
    if (isItNewKv && qrptCurrentDefaultSettingsDataList.length > 0) {
      const newKv = getNewKv();
      setKvData(newKv);
    } else {
      const kvData = kvDataList.find((kv) => kv.OrderId === soRep);
      setKvData(kvData);
    }
  }, [isItNewKv, kvDataList, qrptCurrentDefaultSettingsDataList]);

  useEffect(() => {
    if (kvData && !isItNewKv) {
      const filteredMaterialsData = materialsDataList
        .filter((material) => material.SamKvId === kvData.SamKvId)
        .map((material) => ({
          ...material,
          SamKvUId: kvData.UId,
        }));

      setMaterialsData(filteredMaterialsData);
    }
  }, [materialsDataList, kvData, isItNewKv]);

  useEffect(() => {
    if (kvData?.SamKvId) {
      getTechnician('Id', kvData.TechnicianId);
    }
  }, [kvData]);

  useEffect(() => {
    if (kvData && isItNewKv) {
      updateNewMaterials();
    }
  }, [kvData, isItNewKv]);

  const updateNewMaterials = () => {
    if (!kvData) return;

    const newFilteredMaterialsData = getSamKvDetailsFromInvoiceDetails(
      kvData.SamKvId,
      kvData.UId,
      kvData.ChangedBy
    );

    setMaterialsData(newFilteredMaterialsData);
  };

  const getNewKv = () => {
    const newKv: SamKv = {
      UId: getUniqueID(),
      SamKvId: getUniqueNumber(),
      OrderId: soRep,
      TechnicianId: technicianData?.technicianId ?? 0,
      ChangedBy: getStringOrNull(technicianData?.systemUser),
      CreatedAt: dayjs().toISOString(),
      UpdatedAt: dayjs().toISOString(),
      CalculationVersion: null,
      CustomerInformant: null,
      CustomerName: null,
      LifeTimeTravelCosts: qrptCurrentDefaultSettingsDataList[0].FlatRateAmount,
      LifeTimeVisitedWorkingTimeMin2: 0,
      LifespanOperatingMinutes: 0,
      OperatingCosts: qrptCurrentDefaultSettingsDataList[0].FlatRateAmount,
      OperatingCostsPerMinute: qrptCurrentDefaultSettingsDataList[0].LargeDevicePriceInMinutes,
      OperatingMinutes: 0,
      OperatingMinutesInVisit: 0,
      OrderTakenBy: null,
      ProcessingPercentage: qrptCurrentDefaultSettingsDataList[0].ETProcessingPercentage,
      ReferralFrom: null,
      ReleaseOn: null,
      Remarks: null,
      TakenOverOn: null,
      SmallClientPercentage: qrptCurrentDefaultSettingsDataList[0].SmallPartsPercentage,
      VatRate: qrptCurrentDefaultSettingsDataList[0].Vat,
      CustomerInformedBy: null,
      CustomerInformedAt: null,
      ServiceOrderOfferNotificationId: null,
    };

    return newKv;
  };

  const getUpdatedKvData = (formDataCostCalculation: SamKv) => {
    const updatedKvData: SamKv = {
      ...(kvData as unknown as SamKv),
      OperatingCosts: formDataCostCalculation.OperatingCosts,
      OperatingMinutes: formDataCostCalculation.OperatingMinutes,
      LifeTimeTravelCosts: formDataCostCalculation.LifeTimeTravelCosts,
      LifespanOperatingMinutes: formDataCostCalculation.LifespanOperatingMinutes,
      VatRate: formDataCostCalculation.VatRate,
      OperatingCostsPerMinute: formDataCostCalculation.OperatingCostsPerMinute,
      Remarks: getStringOrNull(formDataCostCalculation.Remarks),
      SmallClientPercentage: getNumberOrNull(formDataCostCalculation.SmallClientPercentage),
      ProcessingPercentage: getNumberOrNull(formDataCostCalculation.ProcessingPercentage),
      OperatingMinutesInVisit: getNumberOrNull(formDataCostCalculation.OperatingMinutesInVisit),
      LifeTimeVisitedWorkingTimeMin2: getNumberOrNull(
        formDataCostCalculation.LifeTimeVisitedWorkingTimeMin2
      ),
      CalculationVersion: getNumberOrNull(formDataCostCalculation.CalculationVersion),
      CustomerInformedAt: getStringOrNull(formDataCostCalculation.CustomerInformedAt),
      CustomerInformedBy: getStringOrNull(formDataCostCalculation.CustomerInformedBy),
    };

    return updatedKvData;
  };

  const insertNewKv = async (formDataCostCalculation: SamKv) => {
    const updatedKvData = getUpdatedKvData(formDataCostCalculation);

    const updatedKvList: SamKv[] = [...kvDataList, updatedKvData];

    await updateKvList(updatedKvList, updatedKvData, 'InsertRecords', 'SamKvsUpdateRequestModel');
  };

  const insertNewMaterials = async () => {
    const updatedMaterialsList: SamKvDetail[] = [...materialsDataList, ...materialsData];

    await updateMaterialsList(
      updatedMaterialsList,
      materialsData,
      'InsertRecords',
      'SamKvDetailsUpdateRequestModel'
    );
  };

  const updateKv = async (formDataCostCalculation: SamKv) => {
    const updatedKvData = getUpdatedKvData(formDataCostCalculation);

    const updatedKvList: SamKv[] = kvDataList.map((kv) => {
      if (kv.SamKvId === updatedKvData.SamKvId) {
        return updatedKvData;
      }
      return kv;
    });

    await updateKvList(updatedKvList, updatedKvData, 'UpdateRecords', 'SamKvsUpdateRequestModel');
  };

  const handleSubmitForm = async (formDataCostCalculation: SamKv) => {
    if (isItNewKv) {
      await insertNewKv(formDataCostCalculation);
      await insertNewMaterials();

      setIsItNewKv(false);
      dispatch(updateKvStatus({ hasKV: true }));
    } else {
      await updateKv(formDataCostCalculation);
    }
  };

  const [activeProductRow, setActiveProductRow] = useState<TableData>();
  const [activeMaterialRow, setActiveMaterialRow] = useState<TableData>();

  const editMaterialRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const modalKV: ModalDetails = {
    name: Modals.KV,
    title: t('KV_ESTIMATED_COST'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          costCalculationRef.current?.handleSubmitForm();
          onClose();
        },
        disabled: readOnly,
      },
    ],
  };

  const modalProductSearch: ModalDetails = {
    name: Modals.ProductSearch,
    title: t('PRODUCT_SEARCH'),
    actions: [
      {
        label: t('BACK'),
        onClick: () => {
          setMaterialSaveType(undefined);
          setActiveMaterialRow(undefined);
          setCurrentModal(modalKV);
        },
        variant: 'outlined',
      },
    ],
  };

  const modalAddEditMaterial: ModalDetails = {
    name: Modals.AddEditMaterial,
    title: materialSaveType === 'add' ? t('ADD_NEW_MATERIAL') : t('EDIT_MATERIAL'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: () => {
          setMaterialSaveType(undefined);
          setActiveMaterialRow(undefined);
          setActiveProductRow(undefined);

          setCurrentModal(modalKV);
        },
        variant: 'outlined',
      },
      {
        label: t('BACK'),
        onClick: () => {
          if (activeProductRow) {
            setActiveProductRow(undefined);
            setCurrentModal(modalProductSearch);
          } else {
            setActiveMaterialRow(undefined);
            setCurrentModal(modalKV);
          }
        },
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          editMaterialRef.current?.handleSubmitForm();
        },
      },
    ],
  };

  const [currentModal, setCurrentModal] = useState<ModalDetails>(modalKV);

  const handleMaterialRowReplaceMaterial = (row: TableData) => {
    setActiveMaterialRow(row);
    setMaterialSaveType('edit');

    setCurrentModal(modalProductSearch);
  };

  const handleMaterialRowEdit = (row: TableData) => {
    setActiveMaterialRow(row);
    setMaterialSaveType('edit');

    setCurrentModal(modalAddEditMaterial);
  };

  const handleMaterialAddClick = () => {
    setActiveMaterialRow(undefined);
    setMaterialSaveType('add');

    setCurrentModal(modalProductSearch);
  };

  const handleProductRowClick = (row: TableData) => {
    setActiveProductRow(row);

    setCurrentModal(modalAddEditMaterial);
  };

  const handleAddEditMaterialSubmit = (formData: SamKvDetail) => {
    let updatedMaterialsData: SamKvDetail[] = [];

    if (materialSaveType === 'add') {
      updatedMaterialsData = [...materialsData, formData];
    } else {
      updatedMaterialsData = materialsData.map((data) => {
        if (data.UId === formData.UId) {
          return formData;
        }
        return data;
      });
    }

    setMaterialsData(updatedMaterialsData);

    if (!isItNewKv) {
      updateMaterials(
        updatedMaterialsData,
        'SamKvId',
        formData.SamKvId,
        formData,
        materialSaveType === 'add' ? 'InsertRecords' : 'UpdateRecords',
        'SamKvDetailsUpdateRequestModel'
      );
    }

    setMaterialSaveType(undefined);
    setActiveMaterialRow(undefined);
    setActiveProductRow(undefined);
    setCurrentModal(modalKV);
  };

  const handleDeleteMaterial = (row: SamKvDetail) => {
    const updatedMaterialsData = materialsData.filter((data) => data.UId !== row.UId);

    setMaterialsData(updatedMaterialsData);

    if (!isItNewKv) {
      updateMaterials(
        updatedMaterialsData,
        'SamKvId',
        row.SamKvId,
        row,
        'DeleteRecords',
        'SamKvDetailsUpdateRequestModel'
      );
    }
  };

  const getModalActions = () => {
    switch (currentModal.name) {
      case Modals.ProductSearch:
        return modalProductSearch.actions;
      case Modals.AddEditMaterial:
        return modalAddEditMaterial.actions;
      case Modals.KV:
      default:
        return modalKV.actions;
    }
  };

  return (
    <CustomModal
      title={currentModal.title}
      open
      onClose={onClose}
      actions={<CustomModalActions actions={getModalActions()} />}
      aria-label={currentModal.name}
    >
      {currentModal.name === Modals.KV && (
        <>
          {readOnlyMsg && (
            <Box>
              <Alert severity="error" variant="filled">
                {readOnlyMsg}
              </Alert>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 3,
              p: 3,
              borderRadius: 2,
              boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
            }}
          >
            <Typography variant="h6" color={'text.primary'}>
              {t('KV_DETAILS')}
            </Typography>

            <ProductDetails dataKv={kvData} dataTechnician={TechnicianData} />
          </Box>

          <Box
            sx={{
              mt: 3,
              borderRadius: 2,
              boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                mr: '24px',
              }}
            >
              <Typography p={'24px'} variant="h6" color={'text.primary'}>
                {t('MATERIALS')}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                disabled={readOnly}
                onClick={handleMaterialAddClick}
              >
                {t('ADD_NEW_MATERIAL')}
              </Button>
            </Box>

            <MaterialTable
              data={materialsData as unknown as TableData[]}
              isLoading={isLoading}
              onReplaceMaterial={handleMaterialRowReplaceMaterial}
              onEdit={handleMaterialRowEdit}
              onDelete={handleDeleteMaterial}
              readOnly={readOnly}
              setReadOnly={setReadOnly}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
            }}
          >
            <Typography p={'24px'} variant="h6" color={'text.primary'}>
              {t('COST_CALCULATION')}
            </Typography>

            {kvData && (
              <CostCalculation
                ref={costCalculationRef}
                onSubmitForm={handleSubmitForm}
                readOnly={readOnly}
                setReadOnly={setReadOnly}
                setReadOnlyMsg={setReadOnlyMsg}
                dataKv={kvData}
                dataMaterials={materialsData}
                dataWorkflowDetail={workflowDetailData}
                dataCurrentUserRightToFrontendAlls={currentUserRightToFrontendAllsData}
              />
            )}
          </Box>
        </>
      )}

      {currentModal.name === Modals.ProductSearch && (
        <ProductSearch onProductRowClick={handleProductRowClick} type={'article'} />
      )}

      {currentModal.name === Modals.AddEditMaterial && (
        <>
          {kvData && materialSaveType && (
            <AddEditMaterial
              ref={editMaterialRef}
              type={materialSaveType}
              kvData={kvData}
              productData={activeProductRow}
              materialData={activeMaterialRow}
              onSubmitForm={handleAddEditMaterialSubmit}
            />
          )}
        </>
      )}
    </CustomModal>
  );
};

export default KVEstimatedCost;
