import { type ClientSetting } from '@/src/hooks/useTourData/tourData.interface';

interface ReturnType {
  qrGUID: string | null;
  systemKind: string | null;
  isValid: boolean;
  mandantError: boolean;
}

let isValid: boolean = false;
let qrGUID: string | null = null;
let mandantError: boolean = false;
let systemKind: string | null = null;

const getMandantID = (url: string) => {
  const regex = /\.(.*?)\./;
  const match = regex.exec(url);

  if (match) {
    switch (match[1].toLowerCase()) {
      case 'undefined':
        return { mandant: match[1], id: -1 };
      case 'service7000':
        return { mandant: match[1], id: 1 };
      case 'schubigerhaushalt':
        return { mandant: match[1], id: 2 };
      default:
        return { mandant: match[1], id: -1 };
    }
  }
};

const getQrGUID = (url: string): string | null => {
  const regex = /\bqr=([^&]+)$/i;
  const match = regex.exec(url);
  qrGUID = match ? match[1] : null;
  return qrGUID;
};

const validateSystemKind = (url: string): string | null => {
  const regex = /^(https?:\/\/)(qr|qr-demo|qr-entwicklung)\./i;
  const match = regex.exec(url);

  if (match) {
    switch (match[2]) {
      case 'qr-demo':
        systemKind = 'Demo';
        break;
      case 'qr':
        systemKind = 'Produktiv';
        break;
      case 'qr-entwicklung':
        systemKind = 'Entwicklung';
        break;
      default:
        systemKind = '';
        break;
    }
  }
  return systemKind;
};

const verifyURL = (url: string, clientSettingsList: ClientSetting[]): ReturnType => {
  if (getQrGUID(url)) {
    const mandantInfo = getMandantID(url);

    if (clientSettingsList.find((clientInfo) => clientInfo.ClientId === mandantInfo?.id)) {
      if (validateSystemKind(url)) {
        isValid = true;
      }
    } else {
      mandantError = true;
    }
  }

  return {
    qrGUID,
    systemKind,
    isValid,
    mandantError,
  };
};

export default verifyURL;
