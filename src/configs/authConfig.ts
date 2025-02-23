import { PublicClientApplication } from '@azure/msal-browser';
import environment from '@/environment'

export const msalConfig = {
  auth: {
    clientId: 'ea16c1e6-7787-4698-a614-97b2c9019a27',
    authority: 'https://login.microsoftonline.com/4fb90828-67cb-4bbf-b21c-b0945c32292b',
    redirectUri: environment.redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage', // Ensures MSAL cache is stored in localStorage
    storeAuthStateInCookie: true, // Useful for IE11 or Edge issues
  },
  system: {
    loggerOptions: {}, // Add logger configuration if needed
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Listen for token events and save access tokens to localStorage
 */
msalInstance.addEventCallback((event) => {
  if (event.eventType === 'msal:acquireTokenSuccess') {
    const tokenResponse: any = event.payload;
    const accessToken: string = tokenResponse?.accessToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }
});

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
