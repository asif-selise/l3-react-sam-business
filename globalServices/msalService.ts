import { type IPublicClientApplication } from '@azure/msal-browser';

let msalInstance: IPublicClientApplication | null = null;

/**
 * Set the MSAL instance globally.
 * @param instance - The MSAL instance to set.
 */
export const setMsalInstance = (instance: IPublicClientApplication): void => {
  msalInstance = instance;
};

/**
 * Get the MSAL instance globally.
 * @returns The MSAL instance.
 */
export const getMsalInstance = (): IPublicClientApplication | null => {
  return msalInstance;
};
