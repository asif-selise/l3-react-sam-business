import InfoGrid from '@/src/components/InfoGrid/InfoGrid';
import { useDispatch } from '@/src/redux/store';
import { showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CustomerDetailsFields } from './types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import {
  type WorkflowDetail,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import EditCustomerDetails from './components/EditCustomerDetails/EditCustomerDetails';
import CreateESO from '@/src/modules/Dashboard/components/ElectronicServiceOrder/components/CreateESO/CreateESO';
import { type CreateESOFields } from '@/src/modules/Dashboard/components/ElectronicServiceOrder/types';
import { useSelector } from 'react-redux';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import createNewEsoData from '@/src/modules/Dashboard/components/ElectronicServiceOrder/utils/createNewEsoData';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { type updateDataStructure } from '@/src/hooks/useUpdateAPI/updateDataModel';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';

interface Props {
  customerDetailsData: ServiceOrderDetail | null;
  getCustomerDetailsData: <K extends keyof ServiceOrderDetail>(
    key: K,
    value: ServiceOrderDetail[K]
  ) => Promise<void>;
  soDetailsList: ServiceOrderDetail[];
  getSODetailsList: () => Promise<ServiceOrderDetail[] | null>;
  updateCustomerDataList: <K extends keyof ServiceOrderDetail>(
    updatedFilteredDataList: ServiceOrderDetail[],
    filteredKey: K,
    filteredValue: ServiceOrderDetail[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
  setCustomerDetailsLoaded: any;
}

const CustomerDetails = ({
  customerDetailsData,
  getCustomerDetailsData,
  soDetailsList,
  getSODetailsList,
  updateCustomerDataList,
  setCustomerDetailsLoaded,
}: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const id = useSelector((state: any) => state.serviceOrder.id);
  const { data: technicianData } = useTechnicianData();

  const [systemUser, setSystemUser] = useState<string>('');

  const {
    dataList: esoList,
    getDataList: getEsoList,
    updateDataList: updateEsoList,
    isLoading: isLoadingWorkflowDetails,
  } = useIndexedDbData<WorkflowDetail>('TourPlanData', 'WorkflowDetails');

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateESO, setOpenCreateESO] = useState(false);
  const createESORef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveChanges = async (formData: CustomerDetailsFields) => {
    if (customerDetailsData) {
      const updatedCustomerData: ServiceOrderDetail = {
        ...customerDetailsData,
        ObjectApartmentId: formData.apartmentNumber,
        CustomerFirstName: formData.firstName,
        CustomerLastName1: formData.lastName1,
        CustomerLastName2: formData.lastName2,
        CustomerStreet: formData.street,
        CustomerEmail: formData.email,
        ContactPerson: formData.contactPerson,
        BusinessCustomerPhone: formData.telephoneBusiness,
        ApartmentFloorAdministration: formData.apartmentNo,
        ApartmentDetailsAdministration: formData.apartmentDetails,
        CustomerPhone: formData.telephone,
        CustomerSMS: formData.smsNumber,
        ContactPersonPhone: formData.contactNumber,
      };

      const updatedSODetailsList: ServiceOrderDetail[] = soDetailsList.map((item) =>
        item.OrderId === id ? updatedCustomerData : item
      );

      await updateCustomerDataList(
        updatedSODetailsList,
        'OrderId',
        Number(id),
        updatedCustomerData,
        'UpdateRecords',
        'ServiceOrderDetailsUpdateRequestModel'
      );

      setOpenEditModal(false);
      getCustomerDetailsData('OrderId', Number(id));
      dispatch(showSuccessMessage(t('CUSTOMER_DETAILS_UPDATE_SUCCESS')));
    }
  };

  const handleSubmitCreateESO = (formData: CreateESOFields) => {
    setOpenCreateESO(false);

    const newEsoData = createNewEsoData(formData, systemUser);

    updateEsoList(
      [...esoList, newEsoData as WorkflowDetail],
      newEsoData,
      'InsertRecords',
      'WorkflowDetailsUpdateRequestModel'
    );
    dispatch(showSuccessMessage(t('ESO_CREATED_SUCCESSFULLY')));
  };

  useEffect(() => {
    if (!isLoadingWorkflowDetails) {
      setCustomerDetailsLoaded(true);
    }
  }, [isLoadingWorkflowDetails]);

  useEffect(() => {
    if (technicianData?.systemUser) {
      setSystemUser(technicianData.systemUser);
    }
  }, [technicianData]);

  useEffect(() => {
    getEsoList().then();
    getSODetailsList().then();
  }, []);

  useEffect(() => {
    if (id) {
      getCustomerDetailsData('OrderId', Number(id)).then();
    }
  }, [id]);

  const modalActionsCreateESO = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            setOpenCreateESO(false);
          },
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: () => {
            createESORef.current?.handleSubmitForm();
          },
        },
      ]}
    />
  );

  return (
    <>
      <Card aria-label="Customer Details" sx={{ height: '100%' }}>
        <CardHeader
          title={t('CUSTOMER_DETAILS')}
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
                // sx={{ pt: 0 }}
                onClick={() => {
                  setOpenCreateESO(true);
                }}
              >
                {t('REPORT_ADDRESS')}
              </Button>
            </Box>
          }
        />

        <Box padding={'24px'}>
          {
            <>
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'NAME'}
                value={`${customerDetailsData?.CustomerFirstName ?? ''} ${customerDetailsData?.CustomerLastName1 ?? ''} ${customerDetailsData?.CustomerLastName2 ?? ''}`}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'STREET'}
                value={customerDetailsData?.CustomerStreet ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'APARTMENT_NO'}
                value={customerDetailsData?.ApartmentFloorAdministration ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'APARTMENT_DETAILS'}
                value={customerDetailsData?.ApartmentDetailsAdministration ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'P/O_BOX'}
                value={`${customerDetailsData?.CustomerZip ?? ''}${(customerDetailsData?.CustomerCity ?? '') ? `, ${customerDetailsData?.CustomerCity ?? ''}` : ''}`}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'TELEPHONE'}
                value={customerDetailsData?.CustomerPhone ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'TELEPHONE_BUSINESS'}
                value={customerDetailsData?.BusinessCustomerPhone ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'EMAIL'}
                value={customerDetailsData?.CustomerEmail ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'SMS_NUMBER'}
                value={customerDetailsData?.CustomerSMS ?? ''}
              />
              <InfoGrid
                sx={{ marginBottom: '16px' }}
                label={'CONTACT_PERSON'}
                value={customerDetailsData?.ContactPerson ?? ''}
              />
              <InfoGrid
                label={'CONTACT_NUMBER'}
                value={customerDetailsData?.ContactPersonPhone ?? ''}
              />
            </>
          }
        </Box>
      </Card>
      {openEditModal && customerDetailsData && (
        <EditCustomerDetails
          open={openEditModal}
          onDiscard={closeEditModal}
          onSaveChanges={handleSaveChanges}
          customerDetails={customerDetailsData}
        />
      )}

      {openCreateESO && (
        <CustomModal
          title={t('CREATE_ESO')}
          open
          onClose={() => {
            setOpenCreateESO(false);
          }}
          actions={modalActionsCreateESO}
        >
          <CreateESO
            ref={createESORef}
            orderId={id}
            newEsoId={144}
            onSubmitForm={handleSubmitCreateESO}
          />
        </CustomModal>
      )}
    </>
  );
};

export default CustomerDetails;
