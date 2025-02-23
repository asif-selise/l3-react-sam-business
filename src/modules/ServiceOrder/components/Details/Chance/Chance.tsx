import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ChanceHistory from './components/ChanceHistory/ChanceHistory';
import {
  type ServiceOrderComplaintDetail,
  type ManagementCompany,
  type ServiceOrderComplaint,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import {
  type CategoryComplain,
  type LevelComplain,
  type Manufacturer,
  type ProductGroup,
  type FaultComplain,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type TableData } from '@/src/components/CustomTable/types';
import dayjs from 'dayjs';
import { type ServiceOrderComplaintDetailFields, type ServiceOrderComplaintFields } from './types';
import AddChanceHistory from './components/AddChanceHistory/AddChanceHistory';
import { getUniqueNumber } from '@/src/helpers/generateID';
import { useSelector } from 'react-redux';
import { getNonEmptyValueOrNull } from '@/src/helpers/sanitizeData';
import { toUTCDateTime } from '@/src/helpers/formatDate';

interface Props {
  onClose: () => void;
}

const Chance = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);

  const [openAddChanceHistoryModal, setOpenAddChanceHistoryModal] = useState(false);
  const [actionButtonDisable, setActionButtonDisable] = useState(true);

  const {
    dataItem: serviceOrderData,
    getDataItem: getServiceOrder,
    isLoading: isLoadingServiceOrderDetails,
  } = useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  const {
    dataItem: complaintData,
    getDataItem: getComplaint,
    dataList: complaintDataList,
    getDataList: getComplaintDataList,
    updateDataLists: updateComplaintList,
    isLoading: isLoadingServiceOrderComplaints,
  } = useIndexedDbData<ServiceOrderComplaint>('TourPlanData', 'ServiceOrderComplaints');

  const {
    filteredDataList: complaintDetailsDataList,
    getFilteredDataList: getComplaintDetails,
    updateDataLists: updateComplaintDetails,
    isLoading: isLoadingServiceOrderComplaintDetails,
  } = useIndexedDbData<ServiceOrderComplaintDetail>('TourPlanData', 'ServiceOrderComplaintDetails');

  const {
    dataList: faultComplains,
    getDataList: getFaultComplains,
    isLoading: isLoadingFaultComplains,
  } = useIndexedDbData<FaultComplain>('MasterData', 'FaultComplains');

  const {
    dataList: managementCompanies,
    getDataList: getManagementCompanies,
    isLoading: isLoadingManagementCompanies,
  } = useIndexedDbData<ManagementCompany>('TourPlanData', 'ManagementCompanies');

  const {
    dataList: manufacturers,
    getDataList: getManufacturers,
    isLoading: isLoadingManufacturers,
  } = useIndexedDbData<Manufacturer>('MasterData', 'Manufacturers');

  const {
    dataList: productGroups,
    getDataList: getProductGroups,
    isLoading: isLoadingProductGroups,
  } = useIndexedDbData<ProductGroup>('MasterData', 'ProductGroups');

  const {
    dataList: levelComplains,
    getDataList: getLevelComplains,
    isLoading: isLoadingLevelComplains,
  } = useIndexedDbData<LevelComplain>('MasterData', 'LevelComplains');

  const {
    dataList: categoryComplains,
    getDataList: getCategoryComplains,
    isLoading: isLoadingCategoryComplains,
  } = useIndexedDbData<CategoryComplain>('MasterData', 'CategoryComplains');

  const { register, control, handleSubmit, watch, setValue } = useForm<ServiceOrderComplaintFields>(
    {
      mode: 'onTouched',
      defaultValues: {
        ManufacturerId: null,
        ProductGroupId: null,
        ComplaintLevelId: null,
        ComplaintCategoryId: null,
        EntryDateTime: dayjs(),
        CompletedOnDateTime: null,
        MustBeCompletedBy: dayjs().add(3, 'day'),
        ReportedBy: null,
        MailReceivedOn: null,
        ComplaintDetails: null,
        UserCreated: null,
        ComplaintRegisteredOn: null,
        UserModified: null,
        ComplaintModifiedBy: null,
        ComplaintModifiedOn: null,
        LastPrintDate: null,
        Cost: null,
        FaultAttributedTo: null,
        WorkflowPoolItemFaultAttributionComplaint: null,
        OpportunityReceivedVia: null,
        OpportunityForwardedTo: null,
        StopMahnso: null,
        ReasonForPriorRepair: null,
      },
    }
  );

  const watchFields = watch();

  const areAllDataLoaded =
    !isLoadingServiceOrderDetails &&
    !isLoadingServiceOrderComplaints &&
    !isLoadingServiceOrderComplaintDetails &&
    !isLoadingFaultComplains &&
    !isLoadingManagementCompanies &&
    !isLoadingManufacturers &&
    !isLoadingProductGroups &&
    !isLoadingLevelComplains &&
    !isLoadingCategoryComplains;

  useEffect(() => {
    setActionButtonDisable(!areAllDataLoaded);
  }, [areAllDataLoaded]);

  useEffect(() => {
    if (id) {
      getComplaint('OrderId', Number(id));
      getServiceOrder('OrderId', Number(id));
    }
  }, [id]);

  useEffect(() => {
    getComplaintDataList();
    getFaultComplains();
    getManagementCompanies();
    getManufacturers();
    getProductGroups();
    getLevelComplains();
    getCategoryComplains();
  }, []);

  useEffect(() => {
    const updateComplaintData = async () => {
      if (!areAllDataLoaded) {
        setTimeout(() => {
          updateComplaintData();
        }, 100);
        return;
      }

      if (serviceOrderData && !complaintData) {
        const newComplaintData: Partial<ServiceOrderComplaint> = {
          OrderId: serviceOrderData.OrderId,
          ComplaintId: getUniqueNumber(),
          ManagementId: serviceOrderData.Administration,
          ManufacturerId: serviceOrderData.Manufacturer ?? null,
          ProductGroupId: serviceOrderData.ProductGroup ?? null,
          CompletedOnDateTime: null,
          ComplaintLevelId: null,
          ComplaintCategoryId: null,
        };

        const updatedComplaintDataList: ServiceOrderComplaint[] = [
          ...complaintDataList,
          newComplaintData as ServiceOrderComplaint,
        ];
        await updateComplaintList(
          updatedComplaintDataList,
          'OrderId',
          serviceOrderData.OrderId,
          newComplaintData,
          'InsertRecords',
          'ServiceOrderComplaintsUpdateRequestModel'
        );
        getComplaint('OrderId', serviceOrderData.OrderId);
      }
    };

    updateComplaintData();
  }, [serviceOrderData]);

  useEffect(() => {
    if (complaintData) {
      if (complaintData?.ComplaintId) {
        getComplaintDetails('ComplaintId', complaintData.ComplaintId);
      }
      if (complaintData?.EntryDateTime) {
        setValue('EntryDateTime', dayjs(complaintData.EntryDateTime));
      }
      if (complaintData?.MustBeCompletedBy) {
        setValue('MustBeCompletedBy', dayjs(complaintData.MustBeCompletedBy));
      }
      if (complaintData?.CompletedOnDateTime) {
        setValue('CompletedOnDateTime', dayjs(complaintData.CompletedOnDateTime));
      }
      if (complaintData?.MailReceivedOn) {
        setValue('MailReceivedOn', dayjs(complaintData.MailReceivedOn));
      }
      if (complaintData?.LastPrintDate) {
        setValue('LastPrintDate', dayjs(complaintData.LastPrintDate));
      }
      if (complaintData?.ComplaintRegisteredOn) {
        setValue('ComplaintRegisteredOn', dayjs(complaintData.ComplaintRegisteredOn));
      }
      if (complaintData?.ComplaintModifiedOn) {
        setValue('ComplaintModifiedOn', dayjs(complaintData.ComplaintModifiedOn));
      }

      setValue('ReportedBy', complaintData.ReportedBy ?? null);
      setValue('UserCreated', complaintData.UserCreated ?? null);
      setValue('UserModified', complaintData.UserModified ?? null);
      setValue('ComplaintDetails', complaintData.ComplaintDetails ?? null);
      setValue('Cost', complaintData.Cost ?? null);
    }

    if (complaintData?.FaultAttributedTo && faultComplains) {
      const faultComplain = faultComplains.find(
        (faultComplain) => faultComplain.QCPTDisplay === complaintData.FaultAttributedTo
      );
      if (faultComplain) {
        setValue('FaultAttributedTo', faultComplain.QCPTDisplay);
      }
    }

    if (complaintData?.ManagementId && managementCompanies) {
      const managementCompany = managementCompanies.find(
        (managementCompany) => managementCompany.AdministrationId === complaintData.ManagementId
      );
      if (managementCompany) {
        setValue('ManagementId', managementCompany.AdministrationId);
      }
    }

    if (complaintData?.ManufacturerId && manufacturers) {
      const manufacturer = manufacturers.find(
        (manufacturer) => manufacturer.Id === complaintData.ManufacturerId
      );
      if (manufacturer) {
        setValue('ManufacturerId', manufacturer.Id);
      }
    }

    if (complaintData?.ProductGroupId && productGroups) {
      const productGroup = productGroups.find(
        (productGroup) => productGroup.Id === complaintData.ProductGroupId
      );
      if (productGroup) {
        setValue('ProductGroupId', productGroup.Id);
      }
    }

    if (complaintData?.ComplaintLevelId && levelComplains) {
      const levelComplain = levelComplains.find(
        (levelComplain) => levelComplain.Id === complaintData.ComplaintLevelId
      );
      if (levelComplain) {
        setValue('ComplaintLevelId', levelComplain.Id);
      }
    }

    if (complaintData?.ComplaintCategoryId && categoryComplains) {
      const categoryComplain = categoryComplains.find(
        (categoryComplain) => categoryComplain.Id === complaintData.ComplaintCategoryId
      );
      if (categoryComplain) {
        setValue('ComplaintCategoryId', categoryComplain.Id);
      }
    }
  }, [
    complaintData,
    faultComplains,
    managementCompanies,
    manufacturers,
    productGroups,
    levelComplains,
    categoryComplains,
  ]);

  const onSubmit: SubmitHandler<ServiceOrderComplaintFields> = async (formData) => {
    if (complaintData) {
      const updatedFormData: ServiceOrderComplaint = {
        ...complaintData,
        ...formData,
        ManagementId: formData.ManagementId,
        EntryDateTime: getNonEmptyValueOrNull(toUTCDateTime(formData.EntryDateTime)),
        MustBeCompletedBy: getNonEmptyValueOrNull(toUTCDateTime(formData.MustBeCompletedBy)),
        CompletedOnDateTime: getNonEmptyValueOrNull(toUTCDateTime(formData.CompletedOnDateTime)),
        ReportedBy: getNonEmptyValueOrNull(formData.ReportedBy),
        FaultAttributedTo: getNonEmptyValueOrNull(formData.FaultAttributedTo),
        MailReceivedOn: getNonEmptyValueOrNull(toUTCDateTime(formData.MailReceivedOn)),
        LastPrintDate: getNonEmptyValueOrNull(toUTCDateTime(formData.LastPrintDate)),
        UserCreated: getNonEmptyValueOrNull(formData.UserCreated),
        ComplaintRegisteredOn: getNonEmptyValueOrNull(
          toUTCDateTime(formData.ComplaintRegisteredOn)
        ),
        UserModified: getNonEmptyValueOrNull(formData.UserModified),
        ComplaintModifiedOn: getNonEmptyValueOrNull(toUTCDateTime(formData.ComplaintModifiedOn)),
        ComplaintDetails: getNonEmptyValueOrNull(formData.ComplaintDetails),
        ManufacturerId: getNonEmptyValueOrNull(formData.ManufacturerId),
        ProductGroupId: getNonEmptyValueOrNull(formData.ProductGroupId),
        ComplaintLevelId: getNonEmptyValueOrNull(formData.ComplaintLevelId),
        ComplaintCategoryId: getNonEmptyValueOrNull(formData.ComplaintCategoryId),
        Cost: getNonEmptyValueOrNull(formData.Cost),
      };

      const updatedComplaintDataList = complaintDataList.map((complaintDataItem) =>
        complaintDataItem.OrderId === updatedFormData.OrderId ? updatedFormData : complaintDataItem
      );

      await updateComplaintList(
        updatedComplaintDataList,
        'OrderId',
        updatedFormData.OrderId,
        updatedFormData,
        'UpdateRecords',
        'ServiceOrderComplaintsUpdateRequestModel'
      );
    }

    onClose();
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleAddChanceHistoryModalClose = () => {
    setOpenAddChanceHistoryModal(false);
  };

  const handleAddChanceHistoryModalSubmit = async (formData: ServiceOrderComplaintDetailFields) => {
    const updatedFormData: Partial<ServiceOrderComplaintDetail> = {
      ComplaintId: complaintData?.ComplaintId,
      OrderId: id,
      EntryDateTime: getNonEmptyValueOrNull(toUTCDateTime(formData.EntryDateTime)),
      MustBeCompletedByDateTime: getNonEmptyValueOrNull(
        toUTCDateTime(formData.MustBeCompletedByDateTime)
      ),
      MailReceivedOnDateTime: getNonEmptyValueOrNull(
        toUTCDateTime(formData.MailReceivedOnDateTime)
      ),
      CompletedOnDateTime: getNonEmptyValueOrNull(toUTCDateTime(formData.CompletedOnDateTime)),
      Remark: getNonEmptyValueOrNull(formData.Remark),
    };

    const updatedComplaintDetailsDataList: ServiceOrderComplaintDetail[] = [
      ...complaintDetailsDataList,
      updatedFormData as ServiceOrderComplaintDetail,
    ];

    const structuredChanceHistoryUpdateData = {
      ...updatedFormData,
      ComplaintDetailId: 0,
      Owner: null,
      ChangedByUser: null,
      ChangedDateTime: null,
      AvailableLetter: null,
      DocumentIncludingPath: null,
    };

    if (complaintData?.ComplaintId) {
      await updateComplaintDetails(
        updatedComplaintDetailsDataList,
        'ComplaintId',
        complaintData.ComplaintId,
        structuredChanceHistoryUpdateData,
        'InsertRecords',
        'ServiceOrderComplaintDetailsUpdateRequestModel'
      );
    }

    handleAddChanceHistoryModalClose();
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onClose,
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: handleSubmitForm,
          disabled: actionButtonDisable,
        },
      ]}
    />
  );

  return (
    <>
      <CustomModal
        title={t('CREATE_NEW_CHANCE')}
        open={true}
        onClose={onClose}
        actions={modalActions}
      >
        <Box
          sx={{
            width: '100%',
            borderRadius: 2,
            p: 3,
            boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
          }}
          aria-label="chance-details"
        >
          <Typography mb={2} variant="h6" color={'text.primary'}>
            {t('CHANCE_DETAILS')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.ManagementId ?? null}
                select
                fullWidth
                label={t('ADMINISTRATION')}
                disabled
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('ManagementId')}
              >
                {managementCompanies?.map((item, index) => (
                  <MenuItem key={index} value={item.AdministrationId}>
                    {item.ManagementAddress}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="EntryDateTime"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('ENTRANCE')}
                      format="DD.MM.YYYY"
                      value={watchFields.EntryDateTime}
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="MustBeCompletedBy"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('MUST_BE_COMPLETED_BY')}
                      format="DD.MM.YYYY"
                      value={watchFields.MustBeCompletedBy}
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="CompletedOnDateTime"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('COMPLETED')}
                      format="DD.MM.YYYY"
                      value={watchFields.CompletedOnDateTime}
                      disabled
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <TextField
                fullWidth
                label={t('REPORTED_BY')}
                InputLabelProps={{ shrink: true }}
                {...register('ReportedBy')}
              />
            </Grid>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.FaultAttributedTo}
                select
                fullWidth
                label={t('CHANGE_FOR')}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('FaultAttributedTo')}
              >
                {faultComplains?.map((faultComplain, index) => (
                  <MenuItem key={index} value={faultComplain.QCPTDisplay}>
                    {faultComplain.QCPTDisplay}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="MailReceivedOn"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('MAIL_RECEIVED_ON')}
                      format="DD.MM.YYYY"
                      value={watchFields.MailReceivedOn}
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="LastPrintDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('LAST_PRINT_DATE')}
                      format="DD.MM.YYYY"
                      value={watchFields.LastPrintDate}
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <TextField
                label={t('REGISTERED_BY')}
                {...register('UserCreated')}
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="ComplaintRegisteredOn"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('COMPLAINT_REGISTERED_ON')}
                      format="DD.MM.YYYY"
                      value={watchFields.ComplaintRegisteredOn}
                      disabled
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={6}>
              <TextField
                label={t('CHANGED_BY')}
                {...register('UserModified')}
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item mobile={6}>
              <Controller
                name="ComplaintModifiedOn"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      {...field}
                      label={t('COMPLAINT_MODIFIED_ON')}
                      format="DD.MM.YYYY"
                      value={watchFields.ComplaintModifiedOn}
                      disabled
                      sx={{ width: '100%' }}
                      views={['year', 'month', 'day']}
                      slotProps={{ textField: { InputLabelProps: { shrink: true } } }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item mobile={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('PROBLEM_CHANCE')}
                InputLabelProps={{ shrink: true }}
                {...register('ComplaintDetails')}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            width: '100%',
            borderRadius: 2,
            mt: 2,
            p: 3,
            boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
          }}
          aria-label="product-details"
        >
          <Typography mb={2} variant="h6" color={'text.primary'}>
            {t('PRODUCT_DETAILS')}
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={3}>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.ManufacturerId ?? null}
                select
                fullWidth
                label={t('BRAND')}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('ManufacturerId')}
              >
                {manufacturers?.map((manufacturer, index) => (
                  <MenuItem key={index} value={manufacturer.Id}>
                    {manufacturer.NameWithoutNumberAtTheEnd}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.ProductGroupId ?? null}
                select
                fullWidth
                label={t('PRODUCT_GROUP')}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('ProductGroupId')}
              >
                {productGroups?.map((productGroup, index) => (
                  <MenuItem key={index} value={productGroup.Id}>
                    {productGroup.Description}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.ComplaintLevelId}
                select
                fullWidth
                label={t('LEVEL')}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('ComplaintLevelId')}
              >
                {levelComplains?.map((levelComplain, index) => (
                  <MenuItem key={index} value={levelComplain.Id}>
                    {levelComplain.Level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={6}>
              <TextField
                value={watchFields.ComplaintCategoryId}
                select
                fullWidth
                label={t('CATEGORY')}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 250 } } } }}
                {...register('ComplaintCategoryId')}
              >
                {categoryComplains?.map((categoryComplain, index) => (
                  <MenuItem key={index} value={categoryComplain.Id}>
                    {categoryComplain.Category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item mobile={12}>
              <TextField
                fullWidth
                label={t('COST')}
                InputLabelProps={{ shrink: true }}
                {...register('Cost')}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            width: '100%',
            borderRadius: 2,
            mt: 2,
            boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
          }}
          aria-label="chance-history"
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
              {t('CHANCE_HISTORY')}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpenAddChanceHistoryModal(true);
              }}
            >
              {t('ADD_NEW_ITEM')}
            </Button>
          </Box>
          <ChanceHistory
            data={complaintDetailsDataList as unknown as TableData[]}
            isLoading={isLoadingServiceOrderComplaintDetails}
          />
        </Box>
      </CustomModal>

      {openAddChanceHistoryModal && (
        <AddChanceHistory
          onClose={handleAddChanceHistoryModalClose}
          onDiscard={onClose}
          onSubmitForm={handleAddChanceHistoryModalSubmit}
        />
      )}
    </>
  );
};

export default Chance;
