import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditDeviceDetails from './components/EditDeviceDetails';
import { useEffect, useState } from 'react';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import {
  type OrderDevice,
  type ManagementCompany,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import {
  type Manufacturer,
  type ProductGroup,
} from '@/src/hooks/useMasterData/masterData.interface';
import AddDevice from './components/AddDevice/AddDevice';
import { type TableData } from '@/src/components/CustomTable/types';
import { getDate } from '@/src/helpers/formatDate';
import CropFreeIcon from '@mui/icons-material/CropFree';
import MeasureEquipment from '../Measurement/MeasureEquipment';
import { getNonEmptyValueOrNull, sanitizeData } from '@/src/helpers/sanitizeData';
import { useSelector } from '@/src/redux/store';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';
import { type updateDataStructure } from '@/src/hooks/useUpdateAPI/updateDataModel';
import SupplementText from '@/src/components/SupplementText/SupplementText';

export interface IEditDeviceData {
  orderId: number;
  manufacturer: number | null;
  bandung: string | null;
  productGroup: number | null;
  model: string | null;
  serialNumber: string | null;
  productNo: string | null;
  operationHours: number | null;
  productionDate: string | null;
  installationDate: Date | null;
  color: string | null;
  serviceOrderDetails: string | null;
}

interface Props {
  deviceData: ServiceOrderDetail | null;
  getDeviceData: <K extends keyof ServiceOrderDetail>(
    key: K,
    value: ServiceOrderDetail[K]
  ) => Promise<void>;
  deviceDataList: ServiceOrderDetail[];
  getDeviceDataList: () => Promise<ServiceOrderDetail[] | null>;
  updateDeviceDataList: <K extends keyof ServiceOrderDetail>(
    updatedFilteredDataList: ServiceOrderDetail[],
    filteredKey: K,
    filteredValue: ServiceOrderDetail[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
  setDeviceDetailsLoaded: any;
}

const DeviceDetails = ({
  deviceData,
  getDeviceData,
  deviceDataList,
  getDeviceDataList,
  updateDeviceDataList,
  setDeviceDetailsLoaded,
}: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state) => state.serviceOrder.id);
  const dispatch = useDispatch();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openMeasurementModal, setOpenMeasurementModal] = useState(false);
  const [orderDeviceData, setOrderDeviceData] = useState<TableData | undefined>(undefined);

  const {
    dataItem: managementCompanyData,
    getDataItem: getManagementCompanyData,
    isLoading: isLoadingManagementCompanies,
  } = useIndexedDbData<ManagementCompany>('TourPlanData', 'ManagementCompanies');
  const {
    dataItem: productGroupData,
    getDataItem: getProductGroupData,
    isLoading: isLoadingProductGroups,
  } = useIndexedDbData<ProductGroup>('MasterData', 'ProductGroups');
  const {
    dataItem: manufacturerData,
    getDataItem: getManufacturerData,
    getDataList: getManufacturerDataList,
    isLoading: isLoadingManufacturers,
  } = useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveChanges = async (formData: IEditDeviceData) => {
    if (deviceData && manufacturerData && managementCompanyData) {
      const updatedDeviceData: ServiceOrderDetail = {
        ...deviceData,
        Manufacturer: formData.manufacturer ?? deviceData.Manufacturer,
        Bonding: formData.bandung ?? deviceData.Bonding,
        ProductGroup: formData.productGroup ?? deviceData.ProductGroup,
        ApplianceModel: formData.model ?? deviceData.ApplianceModel,
        SerialNumber: formData.serialNumber ?? deviceData.SerialNumber,
        ProductionNumber: formData.productNo ?? deviceData.ProductionNumber,
        ProductionDate: formData.productionDate ?? deviceData.ProductionDate,
        CommissioningDate: formData.installationDate
          ? formData.installationDate.toISOString()
          : deviceData.CommissioningDate,
        Color: formData.color ?? deviceData.Color,
      };

      const updatedDeviceDataList: ServiceOrderDetail[] = deviceDataList.map((item) =>
        item.OrderId === deviceData.OrderId ? updatedDeviceData : item
      );
      await updateDeviceDataList(
        updatedDeviceDataList,
        'OrderId',
        Number(id),
        updatedDeviceData,
        'UpdateRecords',
        'ServiceOrderDetailsUpdateRequestModel'
      );

      setOpenEditModal(false);
      getDeviceData('OrderId', Number(id));
      dispatch(showSuccessMessage(t('DEVICE_DETAILS_UPDATED_SUCCESSFULLY')));
    } else {
      dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
    }
  };

  const getEditData = (): IEditDeviceData => {
    return {
      orderId: Number(id),
      manufacturer: deviceData?.Manufacturer ?? null,
      bandung: deviceData?.Bonding ?? null,
      productGroup: productGroupData?.Id ?? null,
      model: deviceData?.ApplianceModel ?? null,
      serialNumber: deviceData?.SerialNumber ?? null,
      productNo: deviceData?.ProductionNumber ?? null,
      operationHours: deviceData?.OperatingHours ?? null,
      productionDate: deviceData?.ProductionDate ?? null,
      installationDate:
        typeof deviceData?.CommissioningDate === 'string'
          ? new Date(deviceData.CommissioningDate)
          : null,
      color: deviceData?.Color ?? null,
      serviceOrderDetails: managementCompanyData?.ImportantMessageFromServiceOrder ?? null,
    };
  };

  const getOrderDeviceData = (): Partial<OrderDevice> => {
    if (id && deviceData && manufacturerData && productGroupData) {
      return {
        ManufacturerId: String(manufacturerData.Id),
        Manufacturer: manufacturerData.NameWithNumberAtTheEnd,
        ProductGroupId: productGroupData.Id,
        ProductGroup: productGroupData.DescriptionWithPgNumberAtEnd,
        SerialNumber: getNonEmptyValueOrNull(deviceData.SerialNumber),
        ProductNumber: getNonEmptyValueOrNull(deviceData.ProductionNumber),
        ASAMMeasurement: getNonEmptyValueOrNull(deviceData.SAM_Measurement),
        Model: getNonEmptyValueOrNull(deviceData.ApplianceModel),
        InstallationDate: getNonEmptyValueOrNull(deviceData.CommissioningDate),
      };
    }

    return {};
  };

  useEffect(() => {
    const areAllDataLoaded =
      !isLoadingManagementCompanies && !isLoadingProductGroups && !isLoadingManufacturers;

    if (areAllDataLoaded) {
      setDeviceDetailsLoaded(true);
    }
  }, [isLoadingManagementCompanies, isLoadingProductGroups, isLoadingManufacturers]);

  useEffect(() => {
    if (id) {
      getDeviceData('OrderId', Number(id));
      getDeviceDataList();
      getManufacturerDataList();
    }
  }, [id]);

  useEffect(() => {
    if (deviceData) {
      getManufacturerData('Id', deviceData.Manufacturer);
      getProductGroupData('Id', deviceData.ProductGroup);
      getManagementCompanyData('AdministrationId', deviceData.Administration);
    }
  }, [deviceData]);

  const handleCopyDeviceToSO = (orderDeviceData: TableData | undefined) => {
    if (!orderDeviceData) {
      return;
    }

    getManufacturerData('Id', Number(orderDeviceData.ManufacturerId));
    getProductGroupData('Id', Number(orderDeviceData.ProductGroupId));

    setOrderDeviceData(orderDeviceData);
  };

  const updateDeviceData = async () => {
    if (deviceData) {
      const updatedDeviceData: ServiceOrderDetail = {
        ...deviceData,
        ApplianceModel: String(orderDeviceData?.Model),
        Manufacturer: Number(orderDeviceData?.ManufacturerId),
        ProductGroup: Number(orderDeviceData?.ProductGroupId),
        SerialNumber: String(orderDeviceData?.SerialNumber),
        CommissioningDate: String(orderDeviceData?.InstallationDate),
        ProductionNumber: String(orderDeviceData?.ProductNumber),
        SAM_Measurement: String(orderDeviceData?.ASAMMeasurement),
      };

      const updatedDeviceDataList: ServiceOrderDetail[] = deviceDataList.map((item) =>
        item.OrderId === deviceData.OrderId ? updatedDeviceData : item
      );
      await updateDeviceDataList(
        updatedDeviceDataList,
        'OrderId',
        Number(id),
        updatedDeviceData,
        'UpdateRecords',
        'ServiceOrderDetailsUpdateRequestModel'
      );
    }

    setOrderDeviceData(undefined);
    setOpenAddModal(false);
    getDeviceData('OrderId', Number(id));

    dispatch(showSuccessMessage(t('DEVICE_DETAILS_UPDATED_SUCCESSFULLY')));
  };

  useEffect(() => {
    if (orderDeviceData) {
      updateDeviceData();
    }
  }, [orderDeviceData]);

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };
  const closeMeasurementModal = () => {
    setOpenMeasurementModal(false);
  };

  return (
    <>
      <Card aria-label="Device Details" sx={{ height: '100%' }}>
        <CardHeader
          title={t('DEVICE_DETAILS')}
          action={
            <Box display={'flex'} alignItems={'center'} columnGap={1}>
              <Button
                variant="text"
                size="medium"
                color="primary"
                sx={{ p: 0 }}
                onClick={() => {
                  setOpenEditModal(true);
                }}
              >
                {t('EDIT')}
              </Button>
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                onClick={() => {
                  setOpenAddModal(true);
                }}
              >
                {t('ADD_DEVICE')}
              </Button>
              <Button
                variant="contained"
                startIcon={<CropFreeIcon />}
                color="primary"
                onClick={() => {
                  setOpenMeasurementModal(true);
                }}
              >
                {t('MEASUREMENT')}
              </Button>
            </Box>
          }
        />
        <Box padding={'24px'}>
          <Typography variant="overline" color={'text.secondary'}>
            {sanitizeData(manufacturerData?.Name)}
          </Typography>

          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Box width={'65%'}>
              <Typography variant="h6" color={'text.primary'}>
                {sanitizeData(deviceData?.ApplianceModel)}
              </Typography>
            </Box>
            <Box width={'35%'}>
              <Typography variant="subtitle1" color={'text.secondary'}>
                {sanitizeData(productGroupData?.Description)}
              </Typography>
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={'16px'}>
            <Typography variant="subtitle2" color={'text.primary'} width={'65%'}>
              {t('BANDUNG')}
            </Typography>
            <Box width={'35%'}>
              <Typography variant="body2" color={'text.primary'}>
                {sanitizeData(deviceData?.Bonding)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mt: '24px' }} />

          <Grid container pt={'16px'} pb={'16px'} columnGap={3} height={'100%'}>
            <Grid item container tablet={3} rowGap={'24px'} flexDirection={'column'}>
              <Grid item height={'7vh'}>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('PRODUCTION_DATE')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.ProductionDate)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('SERIAL_NUMBER')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.SerialNumber)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container tablet={3} rowGap={'24px'} flexDirection={'column'}>
              <Grid item height={'7vh'}>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('INSTALLATION_DATE')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.CommissioningDate) !== '-'
                    ? getDate(deviceData?.CommissioningDate)
                    : '-'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('PRODUCT_NO')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.ProductionNumber)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container tablet={3} rowGap={'24px'} flexDirection={'column'}>
              <Grid item height={'7vh'}>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('OPERATION_HOURS')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.OperatingHours)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" color={'text.primary'}>
                  {t('COLOR')}
                </Typography>

                <Typography variant="body2" color={'text.primary'}>
                  {sanitizeData(deviceData?.Color)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ mb: '24px' }} />

          <Typography variant="subtitle2" color={'text.primary'}>
            {t('MEASUREMENT')}
          </Typography>

          <OverflowTooltip
            text={sanitizeData(deviceData?.SAM_Measurement)}
            variant="body2"
          ></OverflowTooltip>

          <Typography variant="subtitle2" color={'text.primary'} mt={'20px'}>
            {t('SERVICE_ORDER_IMPORTANT_INFO')}
          </Typography>

          <Typography variant="body2" color={'textPrimary'}>
            <SupplementText text={managementCompanyData?.ImportantMessageFromServiceOrder} />
          </Typography>
        </Box>
      </Card>
      {openEditModal && (
        <EditDeviceDetails
          open={openEditModal}
          onDiscard={closeEditModal}
          onSaveChanges={handleSaveChanges}
          data={getEditData()}
        />
      )}

      {openAddModal && (
        <AddDevice
          onClose={handleAddModalClose}
          dataDevice={getOrderDeviceData()}
          onCopyDeviceToSO={handleCopyDeviceToSO}
          deviceData={deviceData}
        />
      )}
      <MeasureEquipment open={openMeasurementModal} onCancel={closeMeasurementModal} />
    </>
  );
};

export default DeviceDetails;
