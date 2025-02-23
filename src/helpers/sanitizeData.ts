export const sanitizeData = (rawData: any) => {
  if (
    rawData !== 'null' &&
    rawData !== 'NULL' &&
    rawData !== null &&
    rawData !== undefined &&
    rawData
  ) {
    return rawData;
  } else return '-';
};

export const getNonEmptyValueOrNull = <T extends string | number>(
  data: T | null | undefined
): T | null => {
  if (data === null || data === undefined || Number.isNaN(data)) return null;
  if (typeof data === 'string' && data.trim() === '') return null;
  return data;
};

export const getStringOrNull = <T>(data: T): string | null => {
  if (data === null || data === undefined || Number.isNaN(data)) return null;
  if (typeof data === 'string' && data.trim() === '') return null;
  return String(data);
};

export const getNumberOrNull = <T>(data: T): number | null => {
  if (data === null || data === undefined || isNaN(Number(data))) return null;
  if (typeof data === 'string' && data.trim() === '') return null;
  return Number(data);
};
