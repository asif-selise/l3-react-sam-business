import { msalConfig } from '@/src/configs/authConfig';
import { EventType, PublicClientApplication, type EventMessage } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { useCookies } from 'react-cookie';
import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  expiresIn: number | null;
}

const msalInstance = new PublicClientApplication(msalConfig);

const Msal = ({ children }: Props) => {
  const location = useLocation();
  const pathname = location.pathname;

  const [cookies, setCookie] = useCookies(['isAuthenticated']);

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event?.payload) {
      if (pathname.includes('/login')) {
        setCookie('isAuthenticated', 'true');
      }
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default Msal;
