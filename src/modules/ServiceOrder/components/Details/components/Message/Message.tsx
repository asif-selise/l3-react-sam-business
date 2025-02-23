import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import EditMessageModal from './components/SendMessageModal/EditMessageModal';
import {
  type ServiceOrderComplaint,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import StarsIcon from '@mui/icons-material/Stars';
import Chance from '../../Chance/Chance';
import { useSelector } from '@/src/redux/store';
import { type IActionType } from '@/src/hooks/useIndexedDbData/type';
import { type updateDataStructure } from '@/src/hooks/useUpdateAPI/updateDataModel';
import SupplementText from '@/src/components/SupplementText/SupplementText';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

interface Props {
  sOData: ServiceOrderDetail | null;
  getSOData: <K extends keyof ServiceOrderDetail>(
    key: K,
    value: ServiceOrderDetail[K]
  ) => Promise<void>;
  sODataList: ServiceOrderDetail[];
  getSODataList: () => Promise<ServiceOrderDetail[] | null>;
  updateSODataList: <K extends keyof ServiceOrderDetail>(
    updatedFilteredDataList: ServiceOrderDetail[],
    filteredKey: K,
    filteredValue: ServiceOrderDetail[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
}

const Message = ({ sOData, getSOData, sODataList, getSODataList, updateSODataList }: Props) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const id = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const [openEditMessageModal, setOpenEditMessageModal] = useState(false);
  const [reportMessage, setReportMessage] = useState<string | null>('');
  const [invoiceMessage, setInvoiceMessage] = useState<string | null>('');
  const [editTenantFault, setEditTenantFault] = useState<boolean>(false);
  const [openChanceModal, setOpenChanceModal] = useState(false);
  const [openChanceConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

  const { dataItem: complaintData, getDataItem: getComplaint } =
    useIndexedDbData<ServiceOrderComplaint>('TourPlanData', 'ServiceOrderComplaints');

  const closeSendMessageModal = () => {
    setOpenEditMessageModal(false);
    setReportMessage(sOData?.FaultReportOrderSupplement ?? '');
    setInvoiceMessage(sOData?.FaultReport ?? '');
  };

  const handleSaveChanges = async (formData: ServiceOrderDetail) => {
    setOpenEditMessageModal(false);

    if (id && sODataList) {
      const updatedSOData: ServiceOrderDetail = {
        ...sOData,
        ...formData,
      };

      try {
        await updateServiceOrderDataList(updatedSOData);
        dispatch(showSuccessMessage(t('MESSAGE_UPDATED_SUCCESSFULLY')));
        getSOData('OrderId', Number(id));
      } catch {
        dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
      }
    }
  };

  const updateServiceOrderDataList = async (updatedServiceOrderData: ServiceOrderDetail) => {
    const updatedSODataList: ServiceOrderDetail[] = sODataList.map((item) =>
      item.OrderId === updatedServiceOrderData.OrderId ? updatedServiceOrderData : item
    );

    await updateSODataList(
      updatedSODataList,
      'OrderId',
      Number(id),
      updatedServiceOrderData,
      'UpdateRecords',
      'ServiceOrderDetailsUpdateRequestModel'
    );
  };

  const handleTenantFaultChange = async (value: boolean) => {
    if (sOData) {
      setEditTenantFault(!editTenantFault);
      const updatedSOData: ServiceOrderDetail = {
        ...sOData,
        TenantFault: value,
      };

      try {
        await updateServiceOrderDataList(updatedSOData);
        setEditTenantFault(false);
        getSOData('OrderId', Number(id));
      } catch {
        dispatch(showErrorMessage(t('SOME_THING_WENT_WRONG')));
      }
    }
  };

  const handleChanceModalClose = () => {
    setOpenChanceModal(false);
  };

  useEffect(() => {
    if (id) {
      getSOData('OrderId', Number(id));
      getComplaint('OrderId', Number(id));
      getSODataList();
    }
  }, [id]);

  useEffect(() => {
    if (sOData) {
      setReportMessage(sOData.FaultReportOrderSupplement);
      setInvoiceMessage(sOData.FaultReport);
    }
  }, [sOData]);

  return (
    <>
      <Card aria-label="Message" sx={{ height: '100%' }}>
        <CardHeader
          title={t('REPORT')}
          action={
            <Box display={'flex'} alignItems={'center'} columnGap={1}>
              <Button
                disabled={isSoReadOnly}
                variant="text"
                size="medium"
                color="primary"
                sx={{ p: 0 }}
                onClick={() => {
                  setOpenEditMessageModal(true);
                }}
              >
                {t('EDIT_MESSAGE')}
              </Button>
              <Button
                variant="contained"
                startIcon={<StarsIcon />}
                color="primary"
                onClick={() => {
                  if (complaintData == null) {
                    setOpenConfirmationModal(true);
                  } else {
                    setOpenChanceModal(true);
                  }
                }}
              >
                {t('CREATE_CHANCE')}
              </Button>
            </Box>
          }
        />

        <Box padding={'24px'}>
          <Box mb={'16px'} display={'flex'} justifyContent={'space-between'}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={isSoReadOnly || !editTenantFault}
                  checked={!!sOData?.TenantFault}
                  onChange={(event) => {
                    handleTenantFaultChange(event.target.checked);
                  }}
                />
              }
              labelPlacement="end"
              label={<Typography variant="body1">{t('TENANT_FAULT')}</Typography>}
            />
            <IconButton
              disabled={isSoReadOnly || !!editTenantFault}
              sx={{ color: editTenantFault ? 'none' : 'primary.main' }}
              size="small"
              onClick={() => {
                if (!editTenantFault) {
                  setEditTenantFault(true);
                }
              }}
            >
              <BorderColorIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Typography mb={'16px'} variant="subtitle2" color={'textPrimary'}>
            {t('INCORRECT_MESSAGE')}
          </Typography>
          <Typography mb={'16px'} variant="body2" color={'textPrimary'}>
            <SupplementText text={sOData?.QcptFaultReport} />
          </Typography>
          <Typography mb={'16px'} variant="subtitle2" color={'textPrimary'}>
            {t('REPORT')}
          </Typography>
          <Typography
            mb={'16px'}
            variant="body2"
            color={'textPrimary'}
            sx={{ whiteSpace: 'pre-line' }}
          >
            <SupplementText text={sOData?.FaultReportOrder} />
          </Typography>
          <Typography mb={'16px'} variant="subtitle2" color={'textPrimary'}>
            {t('REPORT_MESSAGE')}
          </Typography>
          <Typography mb={'16px'} variant="body2" color={'textPrimary'}>
            <SupplementText text={sOData?.FaultReportOrderSupplement} />
          </Typography>
          <Typography mb={'16px'} variant="subtitle2" color={'textPrimary'}>
            {t('INVOICE_MESSAGE')}
          </Typography>
          <Typography mb={'16px'} variant="body2" color={'textPrimary'}>
            <SupplementText text={sOData?.FaultReport} />
          </Typography>
          <Typography mb={'16px'} variant="subtitle2" color={'textPrimary'}>
            {t('EXPRESS_SERVICE')}
          </Typography>
          <Typography variant="body2" color={'textPrimary'}>
            {sanitizeData(sOData?.ExpressServiceStatus)}
          </Typography>
        </Box>
      </Card>
      {openEditMessageModal && sOData && (
        <EditMessageModal
          open={openEditMessageModal}
          onDiscard={closeSendMessageModal}
          onSaveChanges={handleSaveChanges}
          reportMessage={reportMessage}
          setReportMessage={setReportMessage}
          invoiceMessage={invoiceMessage}
          setInvoiceMessage={setInvoiceMessage}
          isEBSO={sOData?.IsEB_SO ?? false}
        />
      )}
      {openChanceModal && <Chance onClose={handleChanceModalClose} />}
      {openChanceConfirmationModal && (
        <ConfirmationModal
          open={openChanceConfirmationModal}
          title="SAM - Service 7000 AG"
          details={t('THERE_IS_NO_CHANCE_FOR_THE_SO', {
            serviceOrder: id,
          })}
          discardButton={{
            title: t('NO'),
            variant: 'contained',
            action: () => {
              setOpenConfirmationModal(false);
            },
          }}
          primaryActionButton={{
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: () => {
              setOpenConfirmationModal(false);
              setOpenChanceModal(true);
            },
          }}
        />
      )}
    </>
  );
};

export default Message;
