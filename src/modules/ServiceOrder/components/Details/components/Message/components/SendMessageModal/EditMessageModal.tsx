import { Box, Button, Card, CardHeader, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import React, { type SetStateAction, useState } from 'react';
import AddMessage from './components/AddMessage/AddMessage';
import { useForm } from 'react-hook-form';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

interface Props {
  open: boolean;
  onDiscard: () => void;
  onSaveChanges: (formData: ServiceOrderDetail) => void;
  reportMessage: string | null;
  invoiceMessage: string | null;
  setInvoiceMessage: React.Dispatch<SetStateAction<string | null>>;
  setReportMessage: React.Dispatch<SetStateAction<string | null>>;
  isEBSO: boolean;
}

type clearMessageType = 'report' | 'invoice';
type confirmationModalType =
  | 'empty-report'
  | 'equal-report-invoice'
  | 'non-equal-report-invoice'
  | '';

const EditMessageModal = ({
  open,
  onDiscard,
  onSaveChanges,
  reportMessage,
  invoiceMessage,
  setInvoiceMessage,
  setReportMessage,
  isEBSO,
}: Props) => {
  const { t } = useTranslation('index');
  const [view, setView] = useState<'editMessage' | 'addMessage'>('editMessage');
  const [messageType, setMessageType] = useState<'report' | 'invoice'>();
  const [selectedMeasure, setSelectedMeasure] = useState<string>('');
  const [selectedErrorType, setSelectedErrorType] = useState<string>('');
  const [selectedFaultLocation, setSelectedFaultLocation] = useState<string>('');
  const [selectedAdditionalText, setSelectedAdditionalText] = useState<string>('');
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [confirmationModalText, setConfirmationModalText] = useState<string>('');
  const [confirmationModalType, setConfirmationModalType] = useState<confirmationModalType>('');

  const onSubmit = (formData: ServiceOrderDetail) => {
    onSaveChanges(formData);
  };

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const resetStates = () => {
    setSelectedMeasure('');
    setSelectedErrorType('');
    setSelectedFaultLocation('');
    setSelectedAdditionalText('');
  };

  const getUpdatedMessageString = (previousMessage: string) => {
    const allTheMessages: string[] = [];

    if (previousMessage) {
      allTheMessages.push(previousMessage);
    }
    if (selectedFaultLocation) {
      allTheMessages.push(selectedFaultLocation);
    }
    if (selectedErrorType) {
      allTheMessages.push(selectedErrorType);
    }
    if (selectedMeasure) {
      allTheMessages.push(selectedMeasure);
    }
    if (selectedAdditionalText) {
      allTheMessages.push(selectedAdditionalText);
    }
    return allTheMessages.join(', ');
  };

  const concatReportMessage = () => {
    const previousMessage = getValues('FaultReportOrderSupplement');
    const updatedMessage = getUpdatedMessageString(previousMessage ?? '');
    setReportMessage(updatedMessage);

    reset({
      FaultReportOrderSupplement: updatedMessage,
      FaultReport: getValues('FaultReport'),
    });

    resetStates();
    setView('editMessage');
  };

  const concatInvoiceMessage = () => {
    const previousMessage = getValues('FaultReport');
    const updatedMessage = getUpdatedMessageString(previousMessage ?? '');

    setInvoiceMessage(updatedMessage);

    reset({
      FaultReportOrderSupplement: getValues('FaultReportOrderSupplement'),
      FaultReport: updatedMessage,
    });

    resetStates();
    setView('editMessage');
  };

  const navigateBack = () => {
    resetStates();
    setView('editMessage');
  };

  const { register, handleSubmit, getValues, reset } = useForm<ServiceOrderDetail>({
    mode: 'onTouched',
    defaultValues: {
      FaultReportOrderSupplement: reportMessage,
      FaultReport: invoiceMessage ?? '',
    },
  });

  const handleAddMessage = (type: 'report' | 'invoice') => {
    setView('addMessage');
    setMessageType(type);
  };

  const clearMessage = (message: clearMessageType) => {
    if (message === 'report') {
      reset({
        FaultReportOrderSupplement: '',
      });
    }
    if (message === 'invoice') {
      reset({
        FaultReport: '',
      });
    }
  };

  const handleCopyToInvoiceMessage = () => {
    const errorTextFieldValue = getValues('FaultReportOrderSupplement');
    const invoiceTextFieldValue = getValues('FaultReport');
    setOpenConfirmationModal(true);

    if (errorTextFieldValue === null || errorTextFieldValue?.trim() === '') {
      setConfirmationModalType('empty-report');
      setConfirmationModalText(t('COPYING_IS_NOT_POSSIBLE'));
    } else if (errorTextFieldValue === invoiceTextFieldValue) {
      setConfirmationModalType('equal-report-invoice');
      setConfirmationModalText(t('THE_INVOICE_TEXT_ALREADY_CORRESPONDS'));
    } else {
      setConfirmationModalType('non-equal-report-invoice');
      setConfirmationModalText(t('OVERWRITE_EXISTING_INVOICE'));
    }
  };

  const getSaveAction = () => {
    if (view === 'editMessage') {
      return handleSubmitForm;
    }

    if (messageType === 'report') {
      return concatReportMessage;
    }

    if (messageType === 'invoice') {
      return concatInvoiceMessage;
    }

    return handleSubmitForm;
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onDiscard,
          variant: 'outlined',
        },
        ...(view !== 'editMessage'
          ? [
              {
                label: t('BACK'),
                variant: 'outlined',
                onClick: navigateBack,
              } as any,
            ]
          : []),
        {
          label: t('SAVE'),
          onClick: getSaveAction(),
        },
      ]}
    />
  );
  return (
    <CustomModal
      title={view === 'editMessage' ? t('MESSAGE') : t('ADD_COMPLETED_WORK')}
      open={open}
      onClose={onDiscard}
      actions={modalActions}
    >
      {view === 'editMessage' && (
        <Box>
          <Card aria-label="Report Text">
            <CardHeader
              title={t('REPORT_TEXT')}
              action={
                <Button
                  variant="soft"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    handleAddMessage('report');
                  }}
                >
                  {t('ADD_MESSAGE')}
                </Button>
              }
            />

            <Box padding={'24px'}>
              <TextField
                fullWidth
                multiline={true}
                rows={5}
                {...register('FaultReportOrderSupplement')}
              />
              <Box display={'flex'} justifyContent={'flex-end'} mt={'8px'}>
                <Button
                  variant="text"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    clearMessage('report');
                  }}
                >
                  {t('CLEAR_MESSAGE')}
                </Button>
                <Button
                  variant="text"
                  size="medium"
                  color="primary"
                  onClick={handleCopyToInvoiceMessage}
                >
                  {t('COPY_TO_INVOICE_MESSAGE')}
                </Button>
              </Box>
            </Box>
          </Card>

          <Card aria-label="Invoice Text" sx={{ mt: '24px' }}>
            <CardHeader
              title={t('INVOICE_TEXT')}
              action={
                <Button
                  variant="soft"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    handleAddMessage('invoice');
                  }}
                >
                  {t('ADD_MESSAGE')}
                </Button>
              }
            />

            <Box padding={'24px'}>
              <TextField fullWidth multiline={true} rows={5} {...register('FaultReport')} />
              <Box display={'flex'} justifyContent={'flex-end'} mt={'8px'}>
                <Button
                  variant="text"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    clearMessage('invoice');
                  }}
                >
                  {t('CLEAR_MESSAGE')}
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
      {view === 'addMessage' && messageType !== undefined && (
        <AddMessage
          setSelectedMeasure={setSelectedMeasure}
          setSelectedErrorType={setSelectedErrorType}
          setSelectedFaultLocation={setSelectedFaultLocation}
          setSelectedAdditionalText={setSelectedAdditionalText}
          selectedMeasure={selectedMeasure}
          selectedErrorType={selectedErrorType}
          selectedFaultLocation={selectedFaultLocation}
          selectedAdditionalText={selectedAdditionalText}
          isEBSO={isEBSO}
          type={messageType}
        />
      )}
      <ConfirmationModal
        open={openConfirmationModal}
        title="SAM - Service 7000 AG"
        details={confirmationModalText}
        {...(confirmationModalType === 'non-equal-report-invoice' && {
          primaryActionButton: {
            title: t('YES'),
            color: 'error',
            actionId: '',
            action: () => {
              const errorTextFieldValue = getValues('FaultReportOrderSupplement');
              reset({
                FaultReport: `${errorTextFieldValue}`,
              });
              setOpenConfirmationModal(false);
            },
          },
        })}
        discardButton={{
          title: confirmationModalType === 'non-equal-report-invoice' ? t('NO') : t('OK'),
          variant: 'contained',
          action: () => {
            setOpenConfirmationModal(false);
          },
        }}
      />
    </CustomModal>
  );
};

export default EditMessageModal;
