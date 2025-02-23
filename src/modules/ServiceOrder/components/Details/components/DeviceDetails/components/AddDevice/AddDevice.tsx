import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { type TableData } from '@/src/components/CustomTable/types';
import { Box, Button } from '@mui/material';
import OrderDevicesTable from '../OrderDevicesTable/OrderDevicesTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ServiceOrderDetail, OrderDevice } from '@/src/hooks/useTourData/tourData.interface';
import ProductSearch from '../../../ProductSearch/ProductSearch';
import AddOrderDevice from '../AddOrderDevice/AddOrderDevice';
import { getUniqueID } from '@/src/helpers/generateID';
import Iconify from '@/src/components/iconify/iconify';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import { useDispatch, useSelector } from 'react-redux';
import MeasureEquipment from '../../../Measurement/MeasureEquipment';
import ScanQRCode from '@/src/modules/ServiceOrder/components/QRCode/components/ScanQRCode/ScanQRCode';
import { getNonEmptyValueOrNull } from '@/src/helpers/sanitizeData';
import useStepperModal from '@/src/hooks/useStepperModal/useStepperModal';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { toUTCDateTime } from '@/src/helpers/formatDate';
import CopyDeviceToSoConfirmationModal from '../CopyDeviceToSoConfirmationModal/CopyDeviceToSoConfirmationModal';

const Modals = {
  AddDevice: 'addDevice',
  ProductSearch: 'productSearch',
  AddOrderDevice: 'addOrderDevice',
  ScanQRCode: 'scanQRCode',
} as const;

const initialOrderDeviceFields: Partial<OrderDevice> = {
  SerialNumber: null,
  ProductNumber: null,
  InstallationDate: null,
  ASAMMeasurement: null,
  Device: null,
};

interface Props {
  onClose: () => void;
  dataDevice: Partial<OrderDevice>;
  onCopyDeviceToSO: (orderDviceData: TableData | undefined) => void;
  deviceData: ServiceOrderDetail | null;
}
const AddDevice = ({ onClose, dataDevice, onCopyDeviceToSO, deviceData }: Props) => {
  const id = useSelector((state: any) => state.serviceOrder.id);
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const isSoReadOnly = useSelector((state: any) => state.soStatus.soStatus === 'ReadOnly');

  const { dataItem: soDetailsData, getDataItem: getSoDetails } =
    useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  const {
    filteredDataList: orderDevicesData,
    getFilteredDataList: getOrderDevices,
    updateDataLists: updateOrderDevices,
    isLoading,
  } = useIndexedDbData<OrderDevice>('TourPlanData', 'OrderDevices');

  const [openMeasurementModal, setOpenMeasurementModal] = useState(false);
  const [activeProductRow, setActiveProductRow] = useState<TableData | undefined>(undefined);
  const [isDisableCopyDeviceFromSO, setIsDisableCopyDeviceFromSO] = useState(false);
  const [activeOrderDeviceRow, setActiveOrderDeviceRow] = useState<TableData | undefined>(
    undefined
  );
  const [orderDeviceFields, setOrderDeviceFields] =
    useState<Partial<OrderDevice>>(initialOrderDeviceFields);
  const addOrderDeviceRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const stepLabels = [t('ADD_DEVICE'), t('PRODUCT_SEARCH'), t('ADD_ORDER_DEVICE')];

  const { getStepDetails, goToNextStep, goToPreviousStep } = useStepperModal(stepLabels);

  const [addEditOrderDeviceType, setAddEditOrderDeviceType] = useState<'add' | 'edit'>('edit');
  const [currentDeviceUId, setCurrentDeviceUId] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [confirmationModalText, setConfirmationModalText] = useState<string>('');

  const [openCopyDeviceToSoModal, setOpenCopyDeviceToSoModal] = useState<boolean>(false);

  const handleAddEditOrderDeviceSubmit = async (formData: OrderDevice) => {
    if (
      !soDetailsData?.ObjectApartmentId ||
      soDetailsData?.ObjectApartmentId === '00000000-0000-0000-0000-000000000000'
    ) {
      dispatch(showErrorMessage(t('APPARTMENT_ID_IS_EMPTY')));
      return;
    } else if (soDetailsData?.Object == null) {
      dispatch(showErrorMessage(t('TEMPORARY_OBJECTID_EMPTY')));
      return;
    }

    let updatedFormData: OrderDevice = {
      ...formData,
      UId: getUniqueID(),
      OrderId: Number(id),
      InstallationDate: getNonEmptyValueOrNull(toUTCDateTime(formData.InstallationDate)),
      TemporaryApartmentGId: soDetailsData?.ObjectApartmentId,
      TemporaryObjectId: soDetailsData?.Object,
      ProductId: formData?.ProductId === 0 ? null : formData?.ProductId,
    };

    let newOrderDevicesData = [...orderDevicesData];
    if (addEditOrderDeviceType === 'add') newOrderDevicesData.push(updatedFormData);

    if (addEditOrderDeviceType === 'edit') {
      const orderDevice = orderDevicesData.find((data) => {
        return data.UId === currentDeviceUId;
      });

      updatedFormData = {
        ...orderDevice,
        ...formData,
        UId: currentDeviceUId,
        OrderId: Number(id),
        InstallationDate: getNonEmptyValueOrNull(toUTCDateTime(formData.InstallationDate)),
        TemporaryApartmentGId: soDetailsData?.ObjectApartmentId,
        TemporaryObjectId: soDetailsData?.Object,
        ProductId: formData?.ProductId === 0 ? null : formData?.ProductId,
      };

      newOrderDevicesData = newOrderDevicesData.map((data) => {
        return data.UId === updatedFormData.UId ? updatedFormData : data;
      });
    }

    updateOrderDevices(
      newOrderDevicesData,
      'OrderId',
      Number(id),
      updatedFormData,
      addEditOrderDeviceType === 'edit' ? 'UpdateRecords' : 'InsertRecords',
      'OrderDevicesUpdateRequestModel'
    );
    setActiveProductRow(undefined);
    setOrderDeviceFields(initialOrderDeviceFields);

    goToPreviousStep(2);
    setCurrentModal(modalAddDevice);
  };

  const handleDeleteOrderDevice = (row: TableData) => {
    const updatedOrderDevicesData = orderDevicesData.filter((data) => data.UId !== row.UId);
    const updatedData = {
      ...row,
      TemporaryApartmentGId: soDetailsData?.ObjectApartmentId,
      TemporaryObjectId: soDetailsData?.Object,
    };

    updateOrderDevices(
      updatedOrderDevicesData,
      'OrderId',
      Number(id),
      updatedData,
      'DeleteRecords',
      'OrderDevicesUpdateRequestModel'
    );

    setCurrentModal(modalAddDevice);
    dispatch(showSuccessMessage(t('ITEM_DELETED_SUCCESSFULLY')));

    getOrderDevices('OrderId', Number(id));
  };

  useEffect(() => {
    if (id) {
      getOrderDevices('OrderId', Number(id));
      getSoDetails('OrderId', Number(id));
    }
  }, [id]);

  const closeMeasurementModal = () => {
    setOpenMeasurementModal(false);
  };

  const handleCopyDeviceFromSO = () => {
    const updatedDataDevice = { ...dataDevice, UId: getUniqueID(), OrderId: Number(id) };

    const newOrderDevicesData = [...orderDevicesData];
    newOrderDevicesData.push(updatedDataDevice as OrderDevice);

    updateOrderDevices(
      newOrderDevicesData,
      'OrderId',
      Number(id),
      updatedDataDevice,
      'InsertRecords',
      'OrderDevicesUpdateRequestModel'
    );
    setIsDisableCopyDeviceFromSO(true);
    setOpenConfirmationModal(true);
    setConfirmationModalText(t('THE_DEVICE_IS_COPIED'));
  };

  const handleScanQrCode = () => {
    setCurrentModal(modalScanQRCode);
  };

  const handleScanDevice = (deviceGuid: string) => {
    setOrderDeviceFields((prevFields) => ({ ...prevFields, Device: deviceGuid }));
    setCurrentModal(modalAddOrderDevice);
  };

  const modalAddDevice: ModalDetails = {
    name: Modals.AddDevice,
    title: t('ADD_DEVICE'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
    ],
  };

  const [currentModal, setCurrentModal] = useState<ModalDetails>(modalAddDevice);

  const handleProductRowClick = (row: TableData) => {
    setAddEditOrderDeviceType('add');
    setActiveProductRow(row);
    goToNextStep();
    setCurrentModal(modalAddOrderDevice);
  };

  const onEditOrderDevice = (row: TableData) => {
    setAddEditOrderDeviceType('edit');
    setActiveProductRow(row);
    setOrderDeviceFields((prevFields) => ({ ...prevFields, Device: row?.Device?.toString() }));
    setCurrentDeviceUId(row.UId as string);
    setCurrentModal(modalAddOrderDevice);
  };

  const modalProductSearch: ModalDetails = {
    name: Modals.ProductSearch,
    title: t('PRODUCT_SEARCH'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
      {
        label: t('BACK'),
        onClick: () => {
          setAddEditOrderDeviceType('edit');
          goToPreviousStep();
          setCurrentModal(modalAddDevice);
        },
        variant: 'outlined',
      },
    ],
  };

  const modalAddOrderDevice: ModalDetails = {
    name: Modals.AddOrderDevice,
    title: addEditOrderDeviceType === 'edit' ? t('EDIT_ORDER_DEVICE') : t('ADD_ORDER_DEVICE'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
      {
        label: t('BACK'),
        onClick: () => {
          setOrderDeviceFields(initialOrderDeviceFields);
          setActiveProductRow(undefined);
          goToPreviousStep();
          if (addEditOrderDeviceType === 'edit') setCurrentModal(modalAddDevice);
          else setCurrentModal(modalProductSearch);
        },
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          addOrderDeviceRef.current?.handleSubmitForm();
        },
      },
    ],
  };

  const modalScanQRCode: ModalDetails = {
    name: Modals.ScanQRCode,
    title: t('SCAN_QR_CODE'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: () => {
          setCurrentModal(modalAddOrderDevice);
        },
        variant: 'outlined',
      },
    ],
  };

  const getModalActions = () => {
    switch (currentModal.name) {
      case Modals.ProductSearch:
        return modalProductSearch.actions;
      case Modals.AddOrderDevice:
        return modalAddOrderDevice.actions;
      case Modals.ScanQRCode:
        return modalScanQRCode.actions;
      case Modals.AddDevice:
      default:
        return modalAddDevice.actions;
    }
  };

  return (
    <>
      <CustomModal
        open={!openMeasurementModal}
        onClose={onClose}
        title={currentModal.title}
        actions={<CustomModalActions actions={getModalActions()} stepDetails={getStepDetails()} />}
        aria-label={currentModal.name}
      >
        {currentModal.name === Modals.AddDevice && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={isSoReadOnly || isDisableCopyDeviceFromSO}
                  onClick={handleCopyDeviceFromSO}
                  startIcon={
                    <Iconify icon={'mdi:arrow-right-circle'} sx={{ color: 'success.main' }} />
                  }
                >
                  {t('COPY_DEVICE_FROM_SO')}
                </Button>
                <Button
                  variant="outlined"
                  disabled={isSoReadOnly}
                  color="primary"
                  onClick={() => {
                    setOpenCopyDeviceToSoModal(true);
                  }}
                  startIcon={
                    <Iconify icon={'mdi:arrow-left-circle'} sx={{ color: 'error.light' }} />
                  }
                >
                  {t('COPY_DEVICE_TO_SO')}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={isSoReadOnly}
                  onClick={() => {
                    setAddEditOrderDeviceType('add');
                    goToNextStep();
                    setCurrentModal(modalProductSearch);
                  }}
                >
                  {t('ADD_NEW_ITEM')}
                </Button>
              </Box>
            </Box>
            <OrderDevicesTable
              data={orderDevicesData as unknown as TableData[]}
              isLoading={isLoading}
              activeOrderDeviceRow={activeOrderDeviceRow}
              setActiveOrderDeviceRow={setActiveOrderDeviceRow}
              onEditOrderDevice={onEditOrderDevice}
              onDeleteOrderDevice={handleDeleteOrderDevice}
            />
          </>
        )}

        {currentModal.name === Modals.ProductSearch && (
          <ProductSearch onProductRowClick={handleProductRowClick} type={'device'} />
        )}

        {currentModal.name === Modals.AddOrderDevice && soDetailsData && (
          <AddOrderDevice
            {...(addEditOrderDeviceType && {
              addEditOrderDeviceType,
            })}
            openMeasurement={setOpenMeasurementModal}
            ref={addOrderDeviceRef}
            onSubmitForm={handleAddEditOrderDeviceSubmit}
            data={activeProductRow}
            fields={orderDeviceFields}
            setFields={setOrderDeviceFields}
            temporaryApartmentGId={soDetailsData.ObjectApartmentId}
            temporaryObjectId={soDetailsData.Object}
            onScanQrCode={handleScanQrCode}
          />
        )}

        {currentModal.name === Modals.ScanQRCode && (
          <ScanQRCode scanOption="add" onScanDevice={handleScanDevice} />
        )}
      </CustomModal>
      <MeasureEquipment open={openMeasurementModal} onCancel={closeMeasurementModal} />
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title={t('MESSAGE')}
          details={confirmationModalText}
          discardButton={{
            title: t('OK'),
            variant: 'contained',
            color: 'primary',
            action: () => {
              setOpenConfirmationModal(false);
              setConfirmationModalText('');
            },
          }}
        />
      )}

      {openCopyDeviceToSoModal && (
        <CopyDeviceToSoConfirmationModal
          open={openCopyDeviceToSoModal}
          activeOrderDeviceRow={activeOrderDeviceRow}
          setOpenCopyDeviceToSoModal={setOpenCopyDeviceToSoModal}
          deviceData={deviceData}
          onCopyDeviceToSO={onCopyDeviceToSO}
        />
      )}
    </>
  );
};

export default AddDevice;
