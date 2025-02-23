import CustomModal from '@/src/components/CustomModal/CustomModal';
import { Grid, MenuItem, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { type CustomerDetailsFields } from '../../types';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import {
  type ApartmentDetail,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import ApartmentDetailsTable from './components/ApartmentDetailsTable/ApartmentDetailsTable';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from '@/src/redux/store';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import AddEditApartmentDetails from './components/AddEditApartmentDetails/AddEditApartmentDetails';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type TableData } from '@/src/components/CustomTable/types';
import { type ApartmentNotAllowedAdministration } from '@/src/hooks/useMasterData/masterData.interface';
import { type IApartmentDetails } from './components/ApartmentDetailsTable/types';
import { isDefined } from '@/src/helpers/genericFunctions';

const Modals = {
  EditCustomerDetails: 'editCustomerDetails',
  ApartmentDetails: 'apartmentDetails',
  AddEditApartmentDetails: 'addEditApartmentDetails',
} as const;

export interface IApartmentNumber {
  value: string;
  label: string;
}

interface Props {
  open: boolean;
  onDiscard: () => void;
  onSaveChanges: (formData: CustomerDetailsFields) => void;
  customerDetails: ServiceOrderDetail;
}

const EditCustomerDetails = ({ open, onDiscard, onSaveChanges, customerDetails }: Props) => {
  const { t } = useTranslation('index');
  const isReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [apartmentNumberList, setApartmentNumberList] = useState<IApartmentNumber[] | []>([]);

  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetailsFields>({
    mode: 'onTouched',
    defaultValues: {
      firstName: customerDetails.CustomerFirstName,
      lastName1: customerDetails.CustomerLastName1,
      lastName2: customerDetails.CustomerLastName2 ?? '',
      street: customerDetails.CustomerStreet,
      apartmentNo: customerDetails.ApartmentFloorAdministration ?? '',
      apartmentNumber: customerDetails.ObjectApartmentId,
      apartmentDetails: customerDetails.ApartmentDetailsAdministration ?? '',
      poBox: `${customerDetails?.CustomerZip ?? ''}${customerDetails?.CustomerCity ? `, ${customerDetails.CustomerCity}` : ''}`,
      telephone: customerDetails.CustomerPhone,
      telephoneBusiness: customerDetails.BusinessCustomerPhone,
      email: customerDetails.CustomerEmail,
      smsNumber: customerDetails.CustomerSMS,
      contactPerson: customerDetails.ContactPerson ?? '',
      contactNumber: customerDetails.ContactPersonPhone,
    },
  });

  const onSubmit: SubmitHandler<CustomerDetailsFields> = (formData) => {
    onSaveChanges(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const viewApartmentDetails = () => {
    setCurrentModal(modalApartmentDetails);
  };

  const {
    filteredDataList: filteredApartmentList,
    getFilteredDataList: getFilteredApartmentList,
    updateDataLists: updateApartmentLists,
    isLoading,
  } = useIndexedDbData<ApartmentDetail>('TourPlanData', 'ApartmentDetails');

  useEffect(() => {
    getFilteredApartmentList('AdministrationId', customerDetails.Administration).then();
  }, []);

  useEffect(() => {
    if (filteredApartmentList) {
      const formattedData = formatApartmentData(filteredApartmentList);
      setApartmentNumberList(formattedData);
    }
  }, [filteredApartmentList]);

  const [activeApartmentDetails, setActiveApartmentDetails] = useState<ApartmentDetail>();
  const [apartmentDetailsSaveType, setApartmentDetailsSaveType] = useState<'add' | 'edit'>();
  const [addNewApartmentDetailsStatus, setAddNewApartmentDetailsStatus] = useState(isReadOnly);

  const {
    customFilteredDataList: apartmentNotAllowedAdministrations,
    getCustomFilteredDataList: getApartmentNotAllowedAdministrations,
  } = useIndexedDbData<ApartmentNotAllowedAdministration>(
    'MasterData',
    'ApartmentNotAllowedAdministrations'
  );

  useEffect(() => {
    getApartmentNotAllowedAdministrations(
      (it) =>
        it.Administration === customerDetails.Administration ||
        it.Administration === customerDetails.GVL_Administration
    ).then();
  }, [customerDetails]);

  useEffect(() => {
    if (!isReadOnly && apartmentNotAllowedAdministrations) {
      if (
        apartmentNotAllowedAdministrations.find(
          (it) => it.Administration === customerDetails.Administration
        )
      ) {
        if (!customerDetails.GVL_Administration) {
          setAddNewApartmentDetailsStatus(false);
        } else if (
          apartmentNotAllowedAdministrations.find(
            (it) => it.Administration === customerDetails.GVL_Administration
          )
        ) {
          setAddNewApartmentDetailsStatus(false);
        }
      }
    }
  }, [apartmentNotAllowedAdministrations]);

  const formatApartmentData = (apartmentList: IApartmentDetails[]): IApartmentNumber[] => {
    return apartmentList.map((apartment) => {
      const formattedStrings: string[] = [];

      if (isDefined(apartment.LastTenant)) {
        formattedStrings.push(`LM: ${apartment.LastTenant}`);
      }
      if (isDefined(apartment.CustomerApartmentNumber)) {
        formattedStrings.push(`[Whg Kd]: ${apartment.CustomerApartmentNumber}`);
      }
      if (isDefined(apartment.Remarks)) {
        formattedStrings.push(`Bem: ${apartment.Remarks}`);
      }

      if (
        isDefined(apartment.AdministrationApartmentFloor) ||
        isDefined(apartment.AdministrationApartmentDetails)
      ) {
        formattedStrings.push(
          `Et: ${apartment.AdministrationApartmentFloor ?? ''} ${apartment.AdministrationApartmentDetails ?? ''}`
        );
      }

      let formattedString = formattedStrings.join(' | ');

      if (isDefined(apartment.ApartmentId)) {
        formattedString += ` (ID: ${apartment.ApartmentId})`;
      }

      return {
        label: formattedString,
        value: apartment.ApartmentGuid,
      };
    });
  };

  const handleSelectApartment = (apartmentGuid: string) => {
    setValue('apartmentNumber', apartmentGuid);
    setCurrentModal(modalEditCustomerDetails);
  };

  const addEditApartmentDetailsRef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const modalEditCustomerDetails: ModalDetails = {
    name: Modals.EditCustomerDetails,
    title: t('EDIT_CUSTOMER_DETAILS'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onDiscard,
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: handleSubmitForm,
        disabled: isReadOnly,
      },
    ],
  };

  const modalApartmentDetails: ModalDetails = {
    name: Modals.ApartmentDetails,
    title: t('APARTMENTS'),
    actions: [
      {
        label: t('BACK'),
        onClick: () => {
          setCurrentModal(modalEditCustomerDetails);
        },
        variant: 'outlined',
      },
    ],
  };

  const modalAddEditApartmentDetails: ModalDetails = {
    name: Modals.AddEditApartmentDetails,
    title: t('ADD_EDIT_APARTMENT_DETAILS'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onDiscard,
        variant: 'outlined',
      },
      {
        label: t('BACK'),
        onClick: () => {
          setActiveApartmentDetails(undefined);
          setApartmentDetailsSaveType(undefined);
          setCurrentModal(modalApartmentDetails);
        },
        variant: 'outlined',
      },
      {
        label: t('SAVE'),
        onClick: () => {
          addEditApartmentDetailsRef.current?.handleSubmitForm();
        },
      },
    ],
  };

  const [currentModal, setCurrentModal] = useState<ModalDetails>(modalEditCustomerDetails);

  const handleApartmentDetailsEdit = (apartmentDetails: ApartmentDetail) => {
    setActiveApartmentDetails(apartmentDetails);
    setApartmentDetailsSaveType('edit');
    setCurrentModal(modalAddEditApartmentDetails);
  };

  const handleApartmentsDetailsSubmit = async (formData: ApartmentDetail) => {
    if (apartmentDetailsSaveType === 'add') {
      const newApartmentList = [...filteredApartmentList, formData];

      await updateApartmentLists(
        newApartmentList,
        'AdministrationId',
        customerDetails.Administration,
        formData,
        'InsertRecords',
        'ApartmentDetailsUpdateRequestModel'
      );
    } else {
      const updatedApartmentList = filteredApartmentList.map((item) =>
        item.UId === formData.UId ? formData : item
      );
      await updateApartmentLists(
        updatedApartmentList,
        'AdministrationId',
        customerDetails.Administration,
        formData,
        'UpdateRecords',
        'ApartmentDetailsUpdateRequestModel'
      );
    }

    setActiveApartmentDetails(undefined);
    setApartmentDetailsSaveType(undefined);
    setCurrentModal(modalApartmentDetails);
  };

  const getModalActions = () => {
    switch (currentModal.name) {
      case Modals.ApartmentDetails:
        return modalApartmentDetails.actions;
      case Modals.AddEditApartmentDetails:
        return modalAddEditApartmentDetails.actions;
      case Modals.EditCustomerDetails:
      default:
        return modalEditCustomerDetails.actions;
    }
  };

  const getModalButtonTopRight = () => {
    switch (currentModal.name) {
      case Modals.ApartmentDetails:
        return {
          label: t('ADD_NEW_ITEM'),
          disabled: addNewApartmentDetailsStatus,
          variant: 'outlined' as const,
          action: () => {
            setApartmentDetailsSaveType('add');
            setCurrentModal(modalAddEditApartmentDetails);
          },
        };
      default:
        return undefined;
    }
  };

  return (
    <CustomModal
      title={currentModal.title}
      open={open}
      onClose={onDiscard}
      actions={<CustomModalActions actions={getModalActions()} />}
      buttonTopRight={getModalButtonTopRight()}
      aria-label={currentModal.name}
    >
      {(() => {
        switch (currentModal.name) {
          case Modals.ApartmentDetails:
            return (
              <ApartmentDetailsTable
                data={filteredApartmentList as unknown as TableData[]}
                isLoading={isLoading}
                onEdit={handleApartmentDetailsEdit}
                onSelect={handleSelectApartment}
              />
            );
          case Modals.AddEditApartmentDetails:
            return (
              apartmentDetailsSaveType && (
                <AddEditApartmentDetails
                  data={activeApartmentDetails}
                  apartmentNotAllowedAdministrations={apartmentNotAllowedAdministrations}
                  type={apartmentDetailsSaveType}
                  soDetailsData={customerDetails}
                  onSubmitForm={handleApartmentsDetailsSubmit}
                  ref={addEditApartmentDetailsRef}
                />
              )
            );
          case Modals.EditCustomerDetails:
          default:
            return (
              <Grid
                container
                spacing={2}
                sx={{ rowGap: 1, pb: 1 }}
                aria-label="Edit Customer Details Modal"
              >
                <Grid item mobile={4}>
                  <TextField
                    required
                    fullWidth
                    label={t('FIRST_NAME')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('firstName', { required: true })}
                    {...(errors.firstName && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>
                <Grid item mobile={4}>
                  <TextField
                    required
                    fullWidth
                    label={`${t('LAST_NAME')} 1`}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('lastName1', { required: true })}
                    {...(errors.lastName1 && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>
                <Grid item mobile={4}>
                  <TextField
                    fullWidth
                    label={`${t('LAST_NAME')} 2`}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('lastName2')}
                  />
                </Grid>
                <Grid item mobile={12}>
                  <TextField
                    required
                    fullWidth
                    label={t('STREET')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    {...register('street', { required: true })}
                    {...(errors.street && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>
                <Grid item mobile={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label={t('APARTMENT_FLOOR')}
                    InputProps={{
                      sx: { pr: 1.5 },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('apartmentNo', { required: true })}
                    {...(errors.apartmentNo && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>
                <Grid item mobile={6} display={'flex'} alignItems={'baseline'} columnGap={3}>
                  <Controller
                    control={control}
                    name="apartmentNumber"
                    rules={{ required: t('FIELD_IS_REQUIRED') }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <TextField
                          {...field}
                          required
                          disabled={isReadOnly}
                          select
                          label={t('APARTMENT_NUMBER')}
                          variant="outlined"
                          value={getValues('apartmentNumber') ?? ''}
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : null}
                        >
                          {apartmentNumberList.map((item, index) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
                  />

                  <Button
                    variant="soft"
                    onClick={viewApartmentDetails}
                    sx={{
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                    }}
                  >
                    {t('APARTMENT_DETAILS')}
                  </Button>
                </Grid>

                <Grid item mobile={6}>
                  <TextField
                    fullWidth
                    label={t('APARTMENT_DETAILS')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('apartmentDetails')}
                  />
                </Grid>
                <Grid item mobile={6}>
                  <TextField
                    disabled
                    fullWidth
                    label={t('P/O_BOX')}
                    defaultValue={'8046 Zurich'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register('poBox', { required: true })}
                    {...(errors.poBox && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>

                <Grid item mobile={6}>
                  <TextField
                    required
                    fullWidth
                    label={t('TELEPHONE')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('telephone', { required: true })}
                    {...(errors.telephone && { error: true, helperText: t('FIELD_IS_REQUIRED') })}
                  />
                </Grid>
                <Grid item mobile={6}>
                  <TextField
                    required
                    fullWidth
                    label={t('TELEPHONE_BUSINESS')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('telephoneBusiness', { required: true })}
                    {...(errors.telephoneBusiness && {
                      error: true,
                      helperText: t('FIELD_IS_REQUIRED'),
                    })}
                  />
                </Grid>

                <Grid item mobile={6}>
                  <TextField
                    required
                    fullWidth
                    label={t('EMAIL')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('email', {
                      required: t('FIELD_IS_REQUIRED'),
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: t('INVALID_EMAIL'),
                      },
                    })}
                    {...(errors.email && { error: true, helperText: errors.email.message })}
                  />
                </Grid>
                <Grid item mobile={6}>
                  <TextField
                    fullWidth
                    label={t('SMS_NUMBER')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('smsNumber')}
                  />
                </Grid>

                <Grid item mobile={6}>
                  <TextField
                    fullWidth
                    label={t('CONTACT_PERSON')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('contactPerson')}
                  />
                </Grid>
                <Grid item mobile={6}>
                  <TextField
                    fullWidth
                    label={t('CONTACT_NUMBER')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isReadOnly}
                    {...register('contactNumber')}
                  />
                </Grid>
              </Grid>
            );
        }
      })()}
    </CustomModal>
  );
};

export default EditCustomerDetails;
