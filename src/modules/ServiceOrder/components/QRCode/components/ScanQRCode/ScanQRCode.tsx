import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  CardActions,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from '@/src/components/iconify/iconify';
import WebcamEasy from 'webcam-easy';
import QrScanner from 'qr-scanner';
import EditImage from '@/src/components/EditImage/EditImage';
import PlaceholderImg from '@/public/assets/images/placeholder.jpg';
import { useTranslation } from 'react-i18next';
import useQrCodeDispose from '@/src/hooks/useQrCodeDispose/useQrCodeDispose';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import useQrCodeAlter from '@/src/hooks/useQrCodeAlter/useQrCodeAlter';
import QrInfo from '../QrInfo/QrInfo';
import { REPLACE_ERROR_MESSAGES } from '@/src/hooks/useQrCodeAlter/constants';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';
import QRInfoModal from './components/QRInfoModal';
import verifyURL from './VerifyURL';
import useGetDeviceInfoFromGuid from '@/src/hooks/useGetDeviceInfoFromGuid/useGetDeviceInfoFromGuid.hooks';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ClientSetting } from '@/src/hooks/useTourData/tourData.interface';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';
import { getDate } from '@/src/helpers/formatDate';
import MandantError from './components/MandantError';
import { type DeviceInfoFromGuid } from '@/src/hooks/useGetDeviceInfoFromGuid/interface';

interface Props {
  scanOption: 'discard' | 'replace' | 'add' | 'read';
  onScanDevice?: (deviceGuid: string) => void;
  enabledQRInfo?: boolean;
}

const ScanQRCode = ({ scanOption, onScanDevice, enabledQRInfo = false }: Props) => {
  const { t } = useTranslation('index');
  const isModalView = scanOption === 'read' || scanOption === 'add';

  const dispatch = useDispatch();

  const { submitQrCodeDispose } = useQrCodeDispose();
  const { submitQrCodeAlter } = useQrCodeAlter();
  const { data: technicianData } = useTechnicianData();
  const { dataList: clientDataList, getDataList: getClientDataList } =
    useIndexedDbData<ClientSetting>('TourPlanData', 'ClientSettings');

  const [openQRInfoModal, setOpenQRInfoModal] = useState<boolean>(false);
  const [openMandantErrorModal, setOpenMandantErrorModal] = useState<boolean>(false);
  const [qrInfoError, setQrInfoError] = useState<string[]>([]);
  const [openQrInfo, setOpenQrInfo] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qrCodeLink, setQRCodeLink] = useState<string>('');
  const [qrGUID, setQrGUID] = useState<string>('');
  const [openEditImage, setOpenEditImage] = useState(false);
  const [systemUser, setSystemUser] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const webcamElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<typeof WebcamEasy | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: deviceInfoFromQR,
    refetch: RefetchQRInfo,
    isLoading: isLoadingQRInfo,
    error: qrInfoFetchingError,
  } = useGetDeviceInfoFromGuid(qrGUID);

  // For Replace QR
  const [activeStep, setActiveStep] = useState(0);
  const [oldDeviceGuid, setOldDeviceGuid] = useState<string>('');
  const [newDeviceGuid, setNewDeviceGuid] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const steps = [t('READ_OLD_QR_INFO'), t('READ_NEW_QR_INFO')];

  useEffect(() => {
    if (webcamElementRef.current && canvasElementRef.current) {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }

      webcamRef.current = new WebcamEasy(
        webcamElementRef.current,
        facingMode,
        canvasElementRef.current
      );

      startWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [facingMode]);

  useEffect(() => {
    if (technicianData?.systemUser) {
      setSystemUser(technicianData.systemUser);
    }
  }, [technicianData]);

  const getDeviceGuidFromQrCode = (qrCode: string): string => {
    try {
      const url = new URL(qrCode);
      const guid = url.searchParams.get('qr');
      return guid ?? '';
    } catch {
      return '';
    }
  };

  const updateDeviceGuid = (qrCodeLink: string): void => {
    const deviceGuid = getDeviceGuidFromQrCode(qrCodeLink);

    if (!deviceGuid) {
      dispatch(showErrorMessage(t('NO_DEVICE_GUID_FOUND')));
      return;
    }

    if (scanOption === 'replace') {
      if (activeStep === 0) {
        setOldDeviceGuid(deviceGuid);
      } else {
        setNewDeviceGuid(deviceGuid);
      }
    }
  };

  const getQRInfo = async (url: string) => {
    const urlInfo = verifyURL(url, clientDataList);

    if (!urlInfo.qrGUID || !urlInfo.isValid) {
      dispatch(
        showErrorMessage(
          "Bitte fotografieren Sie zuerst einen gültigen 'Service 7000 AG/Schubiger-QR-Code'!"
        )
      );
    } else if (urlInfo.mandantError) {
      setOpenMandantErrorModal(true);
    } else if (urlInfo.isValid && urlInfo.qrGUID && !urlInfo.mandantError) {
      setQrGUID(urlInfo.qrGUID);
      setOpenQRInfoModal(true);
    }

    if (urlInfo.systemKind !== 'Produktiv') {
      const message = `${urlInfo.systemKind}-QR-Code Dieser QR-Code darf NICHT produktiv verwendet werden!!!`;
      setQrInfoError((prev) => [...prev, message]);
    }
  };

  const scanQRCode = async (): Promise<void> => {
    if (!capturedImage) {
      setQRCodeLink('');
      return;
    }
    try {
      const result = await QrScanner.scanImage(capturedImage, { returnDetailedScanResult: true });

      if (enabledQRInfo) {
        getQRInfo(result.data);
      }

      setQRCodeLink(result.data);
      updateDeviceGuid(result.data);
    } catch (error) {
      dispatch(showErrorMessage(t('NO_QR_CODE_FOUND')));
      setQRCodeLink('');
    }
  };

  const startWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.start();
    }
  };

  const stopWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.stop();
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const picture = webcamRef.current.snap();
      setCapturedImage(picture as string);
      setQRCodeLink('');
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        setQRCodeLink('');
      };
      reader.readAsDataURL(file);

      const target = event.target;
      target.value = '';
    }
  };

  const discardQRCode = () => {
    const deviceGuid = getDeviceGuidFromQrCode(qrCodeLink);

    if (!deviceGuid) {
      dispatch(showErrorMessage(t('NO_DEVICE_GUID_FOUND')));
      return;
    }

    submitQrCodeDispose(
      {
        SystemUserWithoutDomain: systemUser,
        DeviceGuid: deviceGuid,
      },
      {
        onSuccess: () => {
          dispatch(showSuccessMessage(t('QR_CODE_DISPOSED')));
          setQRCodeLink('');
        },
        onError: () => {
          dispatch(showErrorMessage(t('QR_CODE_DISPOSE_FAILED')));
        },
      }
    );
  };

  const replaceQRCode = () => {
    if (!newDeviceGuid || !oldDeviceGuid) {
      dispatch(showErrorMessage(t('NO_DEVICE_GUID_FOUND')));
      return;
    }

    submitQrCodeAlter(
      {
        SystemUserWithoutDomain: systemUser,
        OldDeviceGuid: oldDeviceGuid,
        NewDeviceGuid: newDeviceGuid,
      },
      {
        onSuccess: () => {
          handleNextStepReplaceQr();
          dispatch(showSuccessMessage(t('QR_CODE_REPLACED')));
        },
        onError: (error) => {
          if (error.message && REPLACE_ERROR_MESSAGES.has(error.message)) {
            dispatch(showErrorMessage(t(error.message)));
          } else {
            dispatch(showErrorMessage(t('QR_CODE_REPLACE_FAILED')));
          }
        },
      }
    );
  };

  const handleCompleteStep = () => {
    setCompletedSteps((prevCompletedSteps) => ({ ...prevCompletedSteps, [activeStep]: true }));
  };

  const handleClearStep = () => {
    setCapturedImage(null);
    setQRCodeLink('');
  };

  const handleGoToStep = (step: number) => {
    handleClearStep();
    setCompletedSteps((prevCompletedSteps) => {
      const newCompletedSteps = { ...prevCompletedSteps };
      for (let i = step; i < steps.length; i++) newCompletedSteps[i] = false;

      return newCompletedSteps;
    });
    setActiveStep(step);
  };

  const handleNextStepReplaceQr = () => {
    handleCompleteStep();
    handleClearStep();
    setActiveStep((prevActiveStep) =>
      prevActiveStep === steps.length - 1 ? prevActiveStep : prevActiveStep + 1
    );
  };

  const handleAddDevice = () => {
    if (onScanDevice) {
      onScanDevice(getDeviceGuidFromQrCode(qrCodeLink));
    }
  };

  const deviceGuidCurrent = getDeviceGuidFromQrCode(qrCodeLink);

  const setQrInfoErrorMessage = (deviceInfoFromQR: DeviceInfoFromGuid) => {
    if (
      deviceInfoFromQR.IsInactive ??
      deviceInfoFromQR.DiscardedOn ??
      deviceInfoFromQR.DiscardedBy
    ) {
      let message = 'Gerät INAKTIV!!!';

      if (deviceInfoFromQR.DiscardedOn) {
        message += ' Weggeworfen am: ' + getDate(deviceInfoFromQR.DiscardedOn);
      }

      if (deviceInfoFromQR.DiscardedBy) {
        message += ', Weggeworfen von: ' + deviceInfoFromQR.DiscardedBy;
      }

      setQrInfoError((prev) => [...prev, message]);
    }
  };

  useEffect(() => {
    if (enabledQRInfo) {
      getClientDataList();
    }
  }, [enabledQRInfo]);

  useEffect(() => {
    if (enabledQRInfo && deviceInfoFromQR && openQRInfoModal) {
      setQrInfoErrorMessage(deviceInfoFromQR);
    }
  }, [enabledQRInfo, deviceInfoFromQR, openQRInfoModal]);

  useEffect(() => {
    if (qrInfoFetchingError) {
      setOpenQRInfoModal(false);
      setQrInfoError([]);
      dispatch(showErrorMessage('Kein Gerät mit diesem QR-Code in der Service 7000 AG gefunden!'));
    }
  }, [qrInfoFetchingError]);

  useEffect(() => {
    if (enabledQRInfo) {
      (async () => {
        if (qrGUID) {
          RefetchQRInfo();
        }
      })();
    }
  }, [enabledQRInfo, qrGUID]);

  return (
    <>
      {isLoadingQRInfo && <LoaderOverlay />}

      {scanOption === 'replace' && (
        <Stepper activeStep={activeStep} sx={{ mb: 3, px: '24%' }}>
          {steps.map((label, index) => {
            return (
              <Step key={index} completed={completedSteps[index]}>
                <StepLabel
                  StepIconProps={{
                    sx: { '&.Mui-completed': { color: 'success.main' } },
                  }}
                  onClick={() => {
                    if (completedSteps[index]) {
                      handleGoToStep(index);
                    }
                  }}
                  sx={{ cursor: completedSteps[index] ? 'pointer' : 'default' }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      <Grid container spacing={4}>
        <Grid item mobile={12} tablet={7}>
          <Card
            sx={{
              position: 'relative',
              width: '100%',
              height: 0,
              paddingTop: '50%',
            }}
          >
            <>
              <video
                id="webcam"
                aria-label="webcam-video"
                autoPlay
                playsInline
                ref={webcamElementRef}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  objectFit: 'cover',
                }}
              />
              <canvas id="webcam-canvas" style={{ display: 'none' }} ref={canvasElementRef} />
            </>
            <Box
              sx={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 3,
              }}
            >
              <IconButton
                aria-label="switch-camera"
                onClick={handleSwitchCamera}
                sx={{
                  bgcolor: 'background.default',
                  borderRadius: '25%',
                  p: 1.5,
                  ':hover': { bgcolor: 'secondary.light' },
                }}
              >
                <Iconify icon="material-symbols:sync" width={26} />
              </IconButton>
              <IconButton
                aria-label="capture-image"
                onClick={handleCapture}
                color="primary"
                sx={{
                  bgcolor: 'background.default',
                  borderRadius: '25%',
                  p: 1.5,
                  ':hover': { bgcolor: 'secondary.light' },
                }}
              >
                <Iconify icon="solar:camera-bold" width={26} />
              </IconButton>
            </Box>
          </Card>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {scanOption === 'discard' && (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                color="primary"
                disabled={!deviceGuidCurrent}
                onClick={discardQRCode}
              >
                {t('DISCARD_QR')}
              </Button>
            )}
            {scanOption === 'replace' && (
              <>
                {activeStep === 0 && (
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    color="primary"
                    disabled={!deviceGuidCurrent}
                    onClick={handleNextStepReplaceQr}
                  >
                    {t('GO_TO_NEXT_THE_STEP_TO_CONTINUE')}
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    color="primary"
                    disabled={!deviceGuidCurrent}
                    onClick={replaceQRCode}
                  >
                    {t('REPLACE_QR')}
                  </Button>
                )}
              </>
            )}
            {scanOption === 'add' && (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                color="primary"
                disabled={!deviceGuidCurrent}
                onClick={handleAddDevice}
              >
                {t('ADD_DEVICE_GUID')}
              </Button>
            )}

            {scanOption !== 'read' && (
              <Tooltip title={t('INFORMATION')}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={() => {
                    setOpenQrInfo(true);
                  }}
                >
                  <Iconify icon="material-symbols:info" width={26} />
                </Button>
              </Tooltip>
            )}
          </Box>
        </Grid>

        <Grid item mobile={12} tablet={5}>
          <Card>
            <CardContent sx={{ position: 'relative', height: '320px' }}>
              <Box
                component="img"
                src={capturedImage ?? PlaceholderImg}
                alt="captured-image"
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  maxHeight: '100%',
                }}
              />
            </CardContent>
            <CardActions sx={{ p: '0 24px 24px 24px', gap: 2, flexDirection: 'column' }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  size="large"
                  color="primary"
                >
                  <Typography variant="subtitle1">{t('UPLOAD_IMAGE')}</Typography>
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  color="primary"
                  onClick={() => {
                    if (capturedImage) setOpenEditImage(true);
                  }}
                >
                  <Typography variant="subtitle1">{t('EDIT_IMAGE')}</Typography>
                </Button>
                <input
                  ref={fileInputRef}
                  aria-label="file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                color="primary"
                disabled={!capturedImage}
                onClick={scanQRCode}
                sx={{ ml: '0 !important' }}
              >
                {scanOption === 'replace'
                  ? activeStep === 0
                    ? t('READ_OLD_QR_INFO')
                    : t('READ_NEW_QR_INFO')
                  : t('READ_QR_INFO')}
              </Button>
            </CardActions>
          </Card>
          <Card sx={{ mt: 3 }}>
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexDirection: { mobile: 'column', desktop: 'row' },
              }}
            >
              <TextField
                value={qrCodeLink}
                label={t('LINK')}
                variant="outlined"
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: { mobile: '100%', desktop: '65%' } }}
              />
              <Button
                variant="outlined"
                color="primary"
                size="large"
                href={qrCodeLink || '#'}
                target="_blank"
                disabled={!qrCodeLink}
                sx={{ width: { mobile: '100%', desktop: '35%' } }}
              >
                <Typography variant="subtitle2">{t('GO_TO_LINK')}</Typography>
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {openQrInfo && (
        <QrInfo
          onClose={() => {
            setOpenQrInfo(false);
          }}
        />
      )}
      {openEditImage && capturedImage && (
        <EditImage
          image={capturedImage}
          onClose={() => {
            setOpenEditImage(false);
          }}
          onSaveImage={(editedImage) => {
            setCapturedImage(editedImage);
            setOpenEditImage(false);
          }}
          hideBackdrop={isModalView}
        />
      )}

      {enabledQRInfo && deviceInfoFromQR && !qrInfoFetchingError && (
        <ConfirmationModal
          open={openQRInfoModal}
          title={''}
          details={<QRInfoModal data={deviceInfoFromQR} errorMessage={qrInfoError} />}
          discardButton={{
            title: t('OK'),
            action: () => {
              setOpenQRInfoModal(false);
              setQrInfoError([]);
            },
          }}
        />
      )}

      <ConfirmationModal
        open={openMandantErrorModal}
        title={''}
        details={<MandantError />}
        discardButton={{
          title: t('OK'),
          action: () => {
            setOpenMandantErrorModal(false);
          },
        }}
      />
    </>
  );
};

export default ScanQRCode;
