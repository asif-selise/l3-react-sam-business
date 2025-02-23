import axios from 'axios';
import { getMsalInstance } from '@/globalServices/msalService';
import { loginRequest } from './authConfig';
import environment from '@/environment';
import { useCookies } from 'react-cookie'; 
import { dispatchErrorMessage } from '@/globalServices/commonService';

const axiosInstance = axios.create({
  baseURL: environment.serviceBusiness,
});

const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    logout();
    return false;
  }
};

const needToLogin = () => {
  const savedDate = localStorage.getItem('tokenDate');
  if (!savedDate) {
    return true;
  }
  const savedDay = new Date(savedDate).toDateString();
  const currentDay = new Date().toDateString();
  return savedDay !== currentDay;
};

axiosInstance.interceptors.request.use(
  async (request) => {
    const forceLogout = needToLogin();
    if (forceLogout) {
      logout();
      throw new Error('Session Expired');
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      const isTokenValid = validateToken(token);
      if (!isTokenValid) {
        try {
          const msalInstance = getMsalInstance();
          if (!msalInstance) {
            logout();
            throw new Error('MSAL instance is not set.');
          }

          const account = msalInstance.getActiveAccount();
          if (!account) {
            logout();
            throw new Error('No active account found.');
          }

          // Obtain a new token silently
          const tokenResponse = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account,
          });

          const newToken = tokenResponse.idToken;
          localStorage.setItem('accessToken', newToken); // Store the new token

          // Update the request headers with the new token
          request.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          logout();
        }
      } else {
        request.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      logout();
    }

    return request;
  },
  (error) => Promise.reject(error)
);

const logout = () => {
  const [, setCookie] = useCookies(['isAuthenticated']);
  setCookie('isAuthenticated', 'false', { path: '/' }); 
  
  localStorage.removeItem('accessToken');
  dispatchErrorMessage('Unauthorized, Please Login.');
  const msalInstance = getMsalInstance();
  msalInstance?.logoutRedirect({
    postLogoutRedirectUri: '/login',
  });
};

export default axiosInstance;

//need to work here