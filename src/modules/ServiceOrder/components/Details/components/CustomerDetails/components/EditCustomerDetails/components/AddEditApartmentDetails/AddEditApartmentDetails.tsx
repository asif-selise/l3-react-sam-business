import {
  type ApartmentDetail,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { Grid, Input, TextField } from '@mui/material';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatDetailedDateTime, getDate } from '@/src/helpers/formatDate';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import { type ApartmentNotAllowedAdministration } from '@/src/hooks/useMasterData/masterData.interface';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';

interface Props {
  data?: ApartmentDetail;
  type: 'add' | 'edit';
  soDetailsData: ServiceOrderDetail;
  apartmentNotAllowedAdministrations: ApartmentNotAllowedAdministration[] | null;
  onSubmitForm: (formData: ApartmentDetail) => void;
}

const AddEditApartmentDetails = forwardRef(
  ({ data, type, soDetailsData, apartmentNotAllowedAdministrations, onSubmitForm }: Props, ref) => {
    const { t } = useTranslation('index');
    const { data: technicianData } = useTechnicianData();

    const getManagementApartment = () => {
      const result = apartmentNotAllowedAdministrations?.find(
        (it) => it.Administration === soDetailsData.Administration
      );
      if (result) {
        return { Administration: soDetailsData.GVL_Administration, OwnerAdministration: null };
      }
      return {
        Administration: soDetailsData.Administration,
        OwnerAdministration: soDetailsData.OwnerAdministration,
      };
    };

    const { register, handleSubmit, getValues } = useForm<ApartmentDetail>({
      defaultValues:
        type === 'edit' && data
          ? data
          : {
              UId: getUniqueID(),
              ApartmentId: getUniqueNumber(),
              ApartmentGuid: getUniqueID(),
              CustomerApartmentNumber: null,
              Remarks: null,
              AdministrationId: getManagementApartment().Administration,
              OwnerId: getManagementApartment().OwnerAdministration,
              AdministrationApartmentFloor: null,
              AdministrationApartmentDetails: null,
              OwnerName: null,
              AdministrationName: null,
              ChangedBy: technicianData?.systemUser,
              ChangedOn: formatDetailedDateTime(new Date()),
              ObjectId: soDetailsData.Object,
              LastTenant: null,
            },
    });

    const onSubmit: SubmitHandler<ApartmentDetail> = (formData) => {
      onSubmitForm(formData);
    };

    useImperativeHandle(ref, () => ({
      handleSubmitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <Grid container spacing={3} aria-label="add-edit-apartment-details">
        <Grid item mobile={6}>
          <TextField
            {...register('CustomerApartmentNumber')}
            label={t('APARTMENT_NO_CUSTOMER')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('OwnerApartmentNumber')}
            label={t('APARTMENT_NO_OWNER')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={12}>
          <TextField
            {...register('Remarks')}
            label={t('REMARKS')}
            multiline
            rows={4}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            {...register('LastTenant')}
            label={t('LAST_TENANT')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('AdministrationId')}
            label={t('ADMINISTRATIVE_NO')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            {...register('AdministrationName')}
            label={t('ADMINISTRATION')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('OwnerName')}
            label={t('OWNER')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            {...register('OwnerId')}
            label={t('OWNER_NO')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('AdministrationApartmentFloor')}
            label={t('FLOOR_USAGE')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <TextField
            {...register('AdministrationApartmentDetails')}
            label={t('APARTMENT_DETAILS_MANAGE')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('ChangedBy')}
            label={t('CHANGED_BY')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item mobile={6}>
          <Input disabled type="hidden" {...register('ChangedOn')} />
          <TextField
            value={getValues('ChangedOn') ? getDate(String(getValues('ChangedOn'))) : '-'}
            label={t('CHANGED_ON')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item mobile={6}>
          <TextField
            {...register('ApartmentId')}
            label={t('APARTMENT_ID')}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    );
  }
);

AddEditApartmentDetails.displayName = 'AddEditApartmentDetails';

export default AddEditApartmentDetails;
