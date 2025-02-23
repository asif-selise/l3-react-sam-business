import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { socketCommand } from '@/src/hooks/useMeasurement/consts/socketCommand';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import environment from '@/environment';
import { type IDataMenuSettings } from '@/src/modules/DataMenu/components/SettingsSection/components/DataMenuSettings/types';
import { getData } from '@/indexedDb';
import { type SocketResponse, type MeasurementResult, type SocketRequest } from './types';

const useMeasurement = (
  selectedMeasurementType: number,
  setOpenConfirmationModal: (value: boolean) => void,
  setConfirmationText: (value: string) => void,
  confirmation: number,
  setConfirmation: (value: number) => void,
  setSecurityCheckModal: (value: boolean) => void,
  securityCheck: boolean,
  retryConfirmation: number,
  setRetryConfirmation: (value: number) => void,
  setRetryConfirmationText: (value: string) => void,
  setRetryConfirmationModal: (value: boolean) => void,
  messageBoxModal: boolean,
  setMessageBoxModal: (value: boolean) => void,
  setMessageBoxText: (value: string) => void
) => {
  const technicianData = useTechnicianData();
  const [result, setResult] = useState<MeasurementResult>({ status: 'initial', message: '' });
  const socketUrl = environment.webSocketURL;
  const dispatch = useDispatch();
  const [webSocket, setWebSocket] = useState<WebSocket | undefined>();
  const [tempSocketResponse, SetTempSocketResponse] = useState<SocketResponse>();
  const [confirmationType, setConfirmationType] = useState<string>('');
  const [process, setProcess] = useState<boolean>(true);
  const [socketRequest, setSocketRequest] = useState<SocketRequest>({
    Command: socketCommand.StartService,
    Port: 0,
    TechnicianName: technicianData?.data?.systemUser,
    UserConfirmation: false,
    TestSequenceNumber: 0,
  });

  const [xmlResponse, setXmlResponse] = useState<string>();

  const fetchSettings = async () => {
    const settings: IDataMenuSettings = await getData('Settings');
    if (settings?.BluetoothComPort) {
      setSocketRequest({
        ...socketRequest,
        Port: settings.BluetoothComPort,
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    socketRequest.TestSequenceNumber = selectedMeasurementType;
    setSocketRequest(socketRequest);
  }, [selectedMeasurementType]);

  useEffect(() => {
    if (result.status === 'canceled') {
      endService();
    }
  }, [result]);

  useEffect(() => {
    if (webSocket === undefined) {
      return;
    }
    socketRequest.Command = securityCheck
      ? socketCommand.StartSecurityCheck
      : socketCommand.CallEndSafetyTest;
    send();
  }, [securityCheck]);

  useEffect(() => {
    if (!messageBoxModal) {
      if (tempSocketResponse !== undefined) {
        if (process) {
          processResponse(tempSocketResponse);
        } else {
          setProcess(true);
          send();
        }
      }
    }
  }, [messageBoxModal]);

  useEffect(() => {
    if (confirmationType !== '') {
      socketRequest.UserConfirmation = confirmation === 1;
      if (confirmationType === 'visualInspection') {
        socketRequest.Command = socketRequest.UserConfirmation
          ? socketCommand.VisualInspectionCheck
          : socketCommand.CallEndSafetyTest;
      }
      if (confirmationType === 'functionTest') {
        socketRequest.Command = socketRequest.UserConfirmation
          ? socketCommand.FunctionTestCheck
          : socketCommand.CallEndSafetyTest;
      }
      if (confirmationType === 'heatingElement') {
        socketRequest.Command = socketCommand.ReceiveBooleanResponseForDeviceHasHeatingElement;
      }
      if (confirmationType === 'testSuccess') {
        socketRequest.Command = socketCommand.ReceiveBooleanResponseForMeasurementResult;
      }
      if (confirmationType === 'retry') {
        if (!confirmation) {
          endService();
          return;
        }
      }
      setConfirmationType('');
      send();
      setConfirmation(0);
    }
  }, [confirmation]);

  useEffect(() => {
    if (webSocket !== undefined && webSocket.readyState !== WebSocket.OPEN) {
      webSocket.onopen = () => {
        startService();
      };
      webSocket.onmessage = (event: any) => {
        const socketResponse: SocketResponse = JSON.parse(event.data as string);
        showStepMessages(socketResponse);
        SetTempSocketResponse(socketResponse);
        if (
          !socketResponse.Result &&
          socketResponse.Command >= socketCommand.PerformRslMeasurement &&
          socketResponse.Command <= socketCommand.PerformRSFMeasurement
        ) {
          setRetryConfirmationText(socketResponse.Message);
          setRetryConfirmationModal(true);
        } else {
          if (socketResponse.Message !== '' && socketResponse.Message !== null) {
            showMessageBox(socketResponse.Message);
            return;
          }
          processResponse(socketResponse);
        }
      };
      webSocket.onclose = (event: any) => {
        setWebSocket(undefined);
        setResult({ status: 'initial', message: result.message });
      };
      webSocket.onerror = (event: any) => {
        dispatch(showErrorMessage('Disconnected, Try Again.'));
        setWebSocket(undefined);
        setResult({ status: 'initial', message: result.message });
      };
    }
  }, [webSocket]);

  useEffect(() => {
    if (retryConfirmation > 0) {
      switch (retryConfirmation) {
        case 1:
          if (tempSocketResponse !== undefined) {
            processResponse(tempSocketResponse);
          }
          setRetryConfirmation(0);
          return;
        case 2:
          socketRequest.Command = socketCommand.SaveMeasurementInfo;
          break;
        case 3:
          socketRequest.Command = socketCommand.CallEndSafetyTest;
          break;
      }
      send();
      setRetryConfirmation(0);
    }
  }, [retryConfirmation]);

  const establishWebsocket = () => {
    if (webSocket === undefined) {
      setWebSocket(new WebSocket(socketUrl));
    }
  };

  const processResponse = (response: SocketResponse) => {
    switch (response.Command) {
      case socketCommand.StartService:
        socketRequest.Command = socketCommand.StartSafetyCheck;
        break;
      case socketCommand.None:
        return;
      case socketCommand.StartSafetyCheck:
        if (!response.Result) {
          dispatch(showErrorMessage('Safety Test Failed, Try Again.'));
          endService();
          return;
        }
        // VisualInspection Confirmation
        setConfirmationType('visualInspection');
        setConfirmationText('VISUAL_INSPECTION_CHECK_OK');
        setOpenConfirmationModal(true);
        return;
      case socketCommand.StartUpdateFirmware:
        // condition check later
        setSecurityCheckModal(true);
        return;
      case socketCommand.StartSecurityCheck:
        socketRequest.Command = response.Result
          ? socketCommand.InitializeTestSequence
          : socketCommand.CallEndSafetyTest;

        if (response.Result && socketRequest.TestSequenceNumber === 1) {
          setProcess(false);
          showMessageBox(
            'Plug the device into the test socket and switch it on.\\n Hold the probe to the conductive point on the housing. '
          );
          return;
        }
        break;
      case socketCommand.InitializeTestSequence:
        // 1->5, 2->13, 3->14, 4->12
        if (!response.Result && socketRequest.TestSequenceNumber === 1) {
          socketRequest.Command = response.Result
            ? socketCommand.InitializeTestSequence
            : socketCommand.CallEndSafetyTest;
          // if (!response.Result) {
          //   retry();
          //   return;
          // }
          setProcess(false);
          showMessageBox(
            'Plug the device into the test socket and switch it on.\\n Hold the probe to the conductive point on the housing. '
          );
          return;
        } else {
          if (socketRequest.TestSequenceNumber === 1) {
            setConfirmationType('heatingElement');
            setConfirmationText('HEATING_ELEMENT');
            setOpenConfirmationModal(true);
            return;
          }
          if (socketRequest.TestSequenceNumber === 2) {
            socketRequest.Command = socketCommand.PerformRltMeasurement;
          }
          if (socketRequest.TestSequenceNumber === 3) {
            socketRequest.Command = socketCommand.PerformRSFMeasurement;
            setProcess(false);
            showMessageBox('Hold the probe to a conductive point on the housing.');
            return;
          }
          if (socketRequest.TestSequenceNumber === 4) {
            socketRequest.Command = socketCommand.PerformIprMeasurement_4;
            setProcess(false);
            showMessageBox(
              'Turn on the device and hold the probe against a conductive point on the housing.'
            );
            return;
          }
        }
        break;
      case socketCommand.ReceiveBooleanResponseForDeviceHasHeatingElement:
        socketRequest.Command = socketCommand.PerformRslMeasurement;
        break;
      case socketCommand.PerformRslMeasurement: // 6
        socketRequest.Command = response.Result
          ? socketCommand.PerformRisoMeasurement
          : socketCommand.PerformRslMeasurement;
        break;
      case socketCommand.PerformRisoMeasurement: // 7
        socketRequest.Command = response.Result
          ? socketCommand.PerformIdiffMeasurement
          : socketCommand.PerformRisoMeasurement;
        break;
      case socketCommand.PerformIdiffMeasurement:
        socketRequest.Command = response.Result
          ? socketCommand.PerformIprMeasurement_1
          : socketCommand.PerformIdiffMeasurement;
        if (response.Result) {
          setProcess(false);
          showMessageBox('Hold the probe to a conductive point on the housing.');
          return;
        }
        break;
      case socketCommand.PerformIprMeasurement_1:
        // Measurement 1 Done
        getMeasurementSuccessConfirmation();
        return;
      case socketCommand.PerformIprMeasurement_2:
        // Measurement 2 End
        getMeasurementSuccessConfirmation();
        return;
      case socketCommand.PerformIprMeasurement_3:
        // End Measurement 3
        getMeasurementSuccessConfirmation();
        return;
      case socketCommand.PerformIprMeasurement_4:
        // Measurement 4 End
        getMeasurementSuccessConfirmation();
        return;
      case socketCommand.PerformRltMeasurement:
        socketRequest.Command = response.Result
          ? socketCommand.PerformIprMeasurement_2
          : socketCommand.PerformRltMeasurement;
        break;
      case socketCommand.PerformRSFMeasurement: // 14
        socketRequest.Command = response.Result
          ? socketCommand.PerformIprMeasurement_3
          : socketCommand.PerformRSFMeasurement;
        if (response.Result) {
          setProcess(false);
          showMessageBox(
            'Plug the device into the test socket and switch it on.\\n Hold the probe to the conductive point on the housing.'
          );
          return;
        }
        break;
      case socketCommand.BuildMeasurementInfoXml:
        return;
      case socketCommand.CallEndSafetyTest:
        endService();
        return;
      case socketCommand.VisualInspectionCheck:
        setConfirmationType('functionTest');
        setConfirmationText('FUNCTION_TEST_OK');
        setOpenConfirmationModal(true);
        return;
      case socketCommand.FunctionTestCheck:
        socketRequest.Command = socketCommand.StartUpdateFirmware;
        break;
      case socketCommand.ReceiveBooleanResponseForMeasurementResult:
        setXmlResponse(response.Resultxml);
        socketRequest.Command = socketCommand.CallEndSafetyTest;
        break;
      case socketCommand.SaveMeasurementInfo:
        getMeasurementSuccessConfirmation();
        return;
    }
    send();
  };

  const getMeasurementSuccessConfirmation = () => {
    setConfirmationType('testSuccess');
    setConfirmationText('MEASUREMENT_SUCCESSFUL');
    setOpenConfirmationModal(true);
  };

  // const retry = () => {
  //   setConfirmationType('retry');
  //   setConfirmationText('RETRY_TEXT');
  //   setOpenConfirmationModal(true);
  // };

  const showStepMessages = (response: SocketResponse) => {
    if (response.StepMessage !== null && response.StepMessage !== '') {
      dispatch(showSuccessMessage(response.StepMessage));
    }
    result.message = response.ResultText;
    // const parsedXml = xmlToJsonUtil(response.Resultxml);
    setResult({ status: 'started', message: response.ResultText });
  };

  const startService = () => {
    setTimeout(() => {
      if (webSocket?.readyState === WebSocket.OPEN) {
        setResult({ status: 'started', message: '' });
        send();
      } else {
        startService();
      }
    }, 1000);
  };

  const send = () => {
    const socketRequestString = JSON.stringify(socketRequest);
    if (webSocket?.readyState === WebSocket.OPEN) {
      webSocket.send(socketRequestString);
    }
  };

  const runMeasurement = async () => {
    establishWebsocket();
  };

  const endService = () => {
    webSocket?.close();
    setWebSocket(undefined);
    setResult({ status: 'initial', message: result.message });
    setSocketRequest({
      Command: socketCommand.StartService,
      Port: 5,
      TechnicianName: technicianData?.data?.systemUser,
      UserConfirmation: false,
      TestSequenceNumber: selectedMeasurementType,
    });
  };

  const showMessageBox = (message: string) => {
    setMessageBoxText(message);
    setMessageBoxModal(true);
  };
  return { runMeasurement, result, setResult, xmlResponse };
};

export default useMeasurement;
