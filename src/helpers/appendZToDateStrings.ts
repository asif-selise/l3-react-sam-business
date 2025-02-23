/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

const appendZIfDateTimeString = (str: string): string => {
  if (typeof str === 'string' && dateTimePattern.test(str)) {
    return str + 'Z';
  }
  return str;
};

const checkAndAppendZ = (objArray: any[]) => {
  objArray.forEach((item) => {
    for (const key in item) {
      item[key] = appendZIfDateTimeString(item[key]);
    }
  });
};

const appendZToDateStrings = (tourDataResponse: any) => {
  for (const key in tourDataResponse) {
    const value = tourDataResponse[key];
    if (Array.isArray(value)) {
      checkAndAppendZ(value);
    } else if (typeof value === 'object' && value !== null) {
      for (const subKey in value) {
        value[subKey] = appendZIfDateTimeString(value[subKey]);
      }
    }
  }

  return tourDataResponse;
};

export default appendZToDateStrings;
