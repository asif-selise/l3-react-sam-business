import { useEffect, useState } from 'react';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import ProblemsWithMeasurement from './components/ProblemsWithMeasurementModal/ProblemsWithMeasurement';
import MeasurementConfirmationModal from './components/MeasurementConfirmationModal/MeasurementConfirmationModal';
import useMeasurement from '@/src/hooks/useMeasurement/useMeasurement.hooks';
import SafetyCheckConfirmationModal from '@/src/modules/ServiceOrder/components/Details/components/Measurement/components/SafetyCheckConfirmationModal/SafetyCheckConfirmationModal';
import { useSelector } from '@/src/redux/store';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import { xmlToJsonUtil } from 'xml-to-json-util';

interface Props {
  open: boolean;
  onCancel: () => void;
}

const MeasureEquipment = ({ open, onCancel }: Props) => {
  const { t } = useTranslation('index');
  const [selectedDevice, setSelectedDevice] = useState<number>(0);
  const [openProblemWithMeasurementModal, setOpenProblemWithMeasurementModal] =
    useState<boolean>(false);
  const [openMeasurementConfirmationModal, setOpenMeasurementConfirmationModal] =
    useState<boolean>(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [retryConfirmationModal, setRetryConfirmationModal] = useState<boolean>(false);
  const [messageBoxModal, setMessageBoxModal] = useState<boolean>(false);
  const [measurementStarted, setMeasurementStarted] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<number>(0);
  const [retryConfirmation, setRetryConfirmation] = useState<number>(0);
  const [retryConfirmationText, setRetryConfirmationText] = useState<string>('');
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [messageBoxText, setMessageBoxText] = useState<string>('');
  const [securityCheckModal, setSecurityCheckModal] = useState<boolean>(false);
  const [securityCheck, setSecurityCheck] = useState<boolean>(false);
  const [testResultStatus, setTestResultStatus] = useState<boolean>(true);
  const [measurementResult, setMeasurementResult] = useState<string>('');
  const { runMeasurement, result, setResult, xmlResponse } = useMeasurement(
    selectedDevice,
    setOpenConfirmationModal,
    setConfirmationText,
    confirmation,
    setConfirmation,
    setSecurityCheckModal,
    securityCheck,
    retryConfirmation,
    setRetryConfirmation,
    setRetryConfirmationText,
    setRetryConfirmationModal,
    messageBoxModal,
    setMessageBoxModal,
    setMessageBoxText
  );
  const [openRetakeMeasurementConfirmationModal, setOpenRetakeMeasurementConfirmationModal] =
    useState<boolean>(false);

  const soId = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const {
    dataItem: sODetailsData,
    getDataItem: getSODetailsData,
    dataList: soDetailsList,
    getDataList: getSODetailsList,
    updateDataLists: updateSODataList,
  } = useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  useEffect(() => {
    if (soId) {
      getSODetailsData('OrderId', soId);
      getSODetailsList();
    }
  }, [soId]);

  const isValidXML = (xmlString: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (sODetailsData?.SAM_Measurement != null && isValidXML(sODetailsData.SAM_Measurement)) {
      const jsonResponse = xmlToJsonUtil(sODetailsData.SAM_Measurement);
      const result = jsonResponse?.Messdaten_SafetytestClass?.z?.map(
        (item: { t: string; w: string }) => `${item.t}: ${item.w}\n`
      );

      setMeasurementResult(result as string);
    }
  }, [sODetailsData]);

  const saveXmlResponse = async () => {
    setMeasurementResult('');
    if (sODetailsData) {
      const updatedDeviceData: ServiceOrderDetail = {
        ...sODetailsData,
        SAM_Measurement: xmlResponse ?? null,
      };

      const updatedSODetailsList: ServiceOrderDetail[] = soDetailsList.map((item) =>
        item.OrderId === soId ? updatedDeviceData : item
      );

      await updateSODataList(
        updatedSODetailsList,
        'OrderId',
        Number(soId),
        updatedDeviceData,
        'UpdateRecords',
        'ServiceOrderDetailsUpdateRequestModel'
      );

      getSODetailsData('OrderId', soId);
    }
  };

  useEffect(() => {
    if (xmlResponse) {
      const jsonResponse = xmlToJsonUtil(xmlResponse);
      const result = jsonResponse?.Messdaten_SafetytestClass?.z?.find(
        (data: any) => data.t === 'Test Result OK'
      );
      if (result?.w === 'no') setTestResultStatus(false);
      else setTestResultStatus(true);

      saveXmlResponse();
    }
  }, [xmlResponse]);

  const handleMeasurementProblem = () => {
    setOpenProblemWithMeasurementModal(true);
  };

  const handleDeviceSelection = (event: SelectChangeEvent<string>) => {
    setSelectedDevice(parseInt(event.target.value));
  };

  const handleInformation = () => {
    const pdfUrl = `/assets/pdfs/${selectedDevice}.pdf`;

    window.open(pdfUrl, '_blank');
  };

  const handleStartMeasurement = () => {
    if (sODetailsData?.SAM_Measurement !== '' || result.message !== '') {
      setOpenRetakeMeasurementConfirmationModal(true);
    } else setOpenMeasurementConfirmationModal(true);
  };

  const closeModal = () => {
    onCancel();
  };

  useEffect(() => {
    // if (!openConfirmationModal) {
    //   setConfirmation(0);
    // }
  }, [openConfirmationModal]);

  useEffect(() => {
    setMeasurementStarted(result.status !== 'initial');
  }, [result]);

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onCancel,
          variant: 'outlined',
        },
      ]}
    />
  );

  return (
    <>
      <CustomModal
        title={t('MEASUREMENT')}
        open={open}
        onClose={closeModal}
        actions={modalActions}
        buttonTopRight={{
          label: t('PROBLEMS_WITH_MEASUREMENT?'),
          action: handleMeasurementProblem,
          variant: 'outlined',
        }}
      >
        <Grid container gap={2}>
          <Grid item tablet={12} desktop={6.3}>
            <Card>
              <CardHeader title={t('DEVICE_DETAILS')} />
              <Box
                sx={{ p: '24px 16px 24px 16px' }}
                display={'flex'}
                flexDirection={'column'}
                rowGap={2}
              >
                <FormControl fullWidth>
                  <InputLabel>{t('MEASUREMENT_FOR')}</InputLabel>
                  <Select
                    aria-label="Select Device"
                    label={t('MEASUREMENT_FOR')}
                    value={selectedDevice.toString()}
                    onChange={handleDeviceSelection}
                    disabled={measurementStarted}
                  >
                    <MenuItem value={1}>Prüfablauf 1 (SK I an Prüfdose)</MenuItem>
                    <MenuItem value={2}>Prüfablauf 2 (SK II an Prüfdose)</MenuItem>
                    <MenuItem value={3}>Prüfablauf 3 (SK I fest angeschlossen)</MenuItem>
                    <MenuItem value={4}>Prüfablauf 4 (SKL1 Kühlschränke mit SKL2 Aufbau)</MenuItem>
                  </Select>
                </FormControl>
                <Box display={'flex'} flexDirection={'column'} alignItems="flex-end" rowGap={1}>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ color: 'primary.light' }}
                    disabled={!selectedDevice}
                    onClick={handleInformation}
                  >
                    {t('INFORMATION_ABOUT_THE_SELECTED_MEASUREMENT')}
                  </Button>
                  {!measurementStarted && (
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      disabled={isSoReadOnly || !selectedDevice}
                      onClick={handleStartMeasurement}
                    >
                      {t('START_MEASUREMENT')}
                    </Button>
                  )}
                  {measurementStarted && (
                    <Button
                      variant="contained"
                      size="medium"
                      color="error"
                      onClick={() => {
                        setResult({ status: 'canceled', message: result.message });
                        setSecurityCheck(false);
                      }}
                    >
                      {t('CANCEL_MEASUREMENT')}
                    </Button>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item tablet={12} desktop={5.4}>
            <Card
              sx={{
                height: { tablet: 'calc(100vh - 580px)', desktop: 'calc(90vh - 190px)' },
                bgcolor: testResultStatus ? COMMON.grey[300] : '#ffe4e8',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    flexGrow: 1,
                  }}
                >
                  {measurementStarted && result.message}
                  {!measurementStarted && measurementResult}
                </Typography>
                {measurementStarted && <LinearProgress sx={{ mt: 2 }} />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CustomModal>
      <SafetyCheckConfirmationModal
        open={securityCheckModal}
        onClose={() => {
          setSecurityCheck(false);
          setSecurityCheckModal(false);
          setSecurityCheck(true);
        }}
      />
      <ConfirmationModal
        open={openProblemWithMeasurementModal}
        title={t('PROBLEMS_WITH_MEASUREMENT?')}
        details={<ProblemsWithMeasurement />}
        discardButton={{
          title: t('OK'),
          action: () => {
            setOpenProblemWithMeasurementModal(false);
          },
        }}
      />
      <ConfirmationModal
        open={openMeasurementConfirmationModal}
        title="SAM - Service 7000 AG"
        details={<MeasurementConfirmationModal />}
        primaryActionButton={{
          title: t('YES'),
          actionId: '',
          action: async () => {
            setOpenMeasurementConfirmationModal(false);
            await runMeasurement();
          },
        }}
        secondaryActionButton={{
          title: t('NO'),
          actionId: '',
          action: () => {},
        }}
        discardButton={{
          title: t('DISCARD'),
          action: () => {
            setOpenMeasurementConfirmationModal(false);
          },
        }}
      />
      {openConfirmationModal && (
        <ConfirmationModal
          open={openConfirmationModal}
          title={t('CONFIRMATION')}
          details={t(confirmationText)}
          primaryActionButton={{
            title: t('YES'),
            color: 'primary',
            actionId: '',
            action: () => {
              setConfirmation(1);
              setOpenConfirmationModal(false);
            },
          }}
          discardButton={{
            title: t('NO'),
            variant: 'contained',
            action: () => {
              setConfirmation(2);
              setOpenConfirmationModal(false);
            },
          }}
        />
      )}
      {retryConfirmationModal && (
        <ConfirmationModal
          open={retryConfirmationModal}
          title={t('CONFIRMATION')}
          details={t(retryConfirmationText)}
          primaryActionButton={{
            title: t('RETRY'),
            color: 'primary',
            actionId: '',
            action: () => {
              setRetryConfirmation(1);
              setRetryConfirmationModal(false);
            },
          }}
          secondaryActionButton={{
            title: t('ABORT'),
            variant: 'contained',
            actionId: '',
            action: () => {
              setRetryConfirmation(2);
              setRetryConfirmationModal(false);
            },
          }}
          discardButton={{
            title: t('CANCEL'),
            variant: 'contained',
            action: () => {
              setRetryConfirmation(3);
              setRetryConfirmationModal(false);
            },
          }}
        />
      )}
      {messageBoxModal && (
        <ConfirmationModal
          open={messageBoxModal}
          title={t('MESSAGE')}
          details={messageBoxText}
          discardButton={{
            title: t('OK'),
            variant: 'contained',
            color: 'primary',
            action: () => {
              setMessageBoxModal(false);
            },
          }}
        />
      )}
      <ConfirmationModal
        open={openRetakeMeasurementConfirmationModal}
        title={t('CONFIRMATION')}
        details={t('A_MEASUREMENT_RESULT')}
        primaryActionButton={{
          title: t('YES'),
          color: 'primary',
          actionId: '',
          action: () => {
            setOpenRetakeMeasurementConfirmationModal(false);
            setOpenMeasurementConfirmationModal(true);
          },
        }}
        discardButton={{
          title: t('NO'),
          variant: 'contained',
          action: () => {
            setOpenRetakeMeasurementConfirmationModal(false);
          },
        }}
      />
    </>
  );
};

export default MeasureEquipment;
