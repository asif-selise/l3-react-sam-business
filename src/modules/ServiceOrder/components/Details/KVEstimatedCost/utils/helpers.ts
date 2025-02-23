import dayjs from 'dayjs';
import { type PersonalEffort } from '@/src/hooks/useTourData/tourData.interface';
import {
  convertToUtcDate,
  convertToUtcDateTime,
  getMillis,
  getUtcAdjustedDateKeepingOriginalTime,
  getUtcDateTimeSubtractedByDay,
  getUtcToday,
  getUtcToday1900,
} from '@/src/helpers/formatDateByLuxon';
import { isDefined } from '@/src/helpers/genericFunctions';

export const roundNumber = (
  number: number,
  multiple: number,
  roundLikeSQLFunction: boolean
): number => {
  let value = number;
  let factor = multiple;

  if (factor === 0 || value === 0) {
    return number;
  } else {
    factor = factor * 100;

    if (roundLikeSQLFunction) {
      value = Math.round(value * 10000) / 10000; // Equivalent to rounding to 4 decimal places
    }

    value = value / factor + 0.000001;
    value = Math.round(value * 100) / 100; // Equivalent to rounding to 2 decimal places
    value = value * factor;
    return value;
  }
};

// Commented bcz of no usage
// export const getDateFilter = () => {
//   const now = new Date();
//
//   const year = now.getFullYear();
//   const month = padZero(now.getMonth() + 1, 2);
//   const day = padZero(now.getDay(), 2);
//   const hours = padZero(0, 2);
//   const minutes = padZero(0, 2);
//   const seconds = padZero(0, 2);
//   const milliseconds = padZero(0, 3);
//
//   const dateFilter = new Date(
//     `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
//   );
//
//   return dateFilter;
// };

// Commented bcz of no usage
// export const getTimeFilter = () => {
//   const now = new Date();
//
//   const year = padZero(1900, 4);
//   const month = padZero(1, 2);
//   const day = padZero(1, 2);
//   const hours = padZero(now.getHours(), 2);
//   const minutes = padZero(now.getMinutes(), 2);
//   const seconds = padZero(now.getSeconds(), 2);
//   const milliseconds = padZero(now.getMilliseconds(), 3);
//
//   const timeFilter = new Date(
//     `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
//   );
//
//   return timeFilter;
// };

// Commented bcz of no usage
// Function to pad single digit numbers with leading zeros
// export const padZero = (num: number, size: number) => {
//   let s = num.toString();
//   while (s.length < size) s = '0' + s;
//   return s;
// };

// Commented bcz of no usage
// export const toDate = (value: string | dayjs.Dayjs | Date | null | undefined): Date => {
//   if (value === null || value === undefined) {
//     return new Date();
//   } else if (value instanceof Date) {
//     return value;
//   } else if (dayjs.isDayjs(value)) {
//     return value.toDate();
//   } else if (typeof value === 'string') {
//     const date = new Date(value);
//     return isNaN(date.getTime()) ? new Date() : date;
//   } else {
//     throw new Error('Invalid type: value must be a string, dayjs, Date, null, or undefined');
//   }
// };

// Commented bcz of no usage
// export const toMilliseconds = (value: Date | null | undefined): number => {
//   if (value === null || value === undefined) return 0;
//   return (
//     value.getHours() * 60 * 60 * 1000 +
//     value.getMinutes() * 60 * 1000 +
//     value.getSeconds() * 1000 +
//     value.getMilliseconds()
//   );
// };

// Commented bcz of no usage
// export const getToday = () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return today;
// };

export const revertDateTime1900 = (dateTime: string) => {
  if (!dateTime) {
    return '-';
  }

  const date = new Date(dateTime);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date(1900, 0, 1, hours, minutes));
};

export const dateTime1900toISO8601 = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getDateTime1900 = (time: dayjs.Dayjs | string | Date) => {
  // this function needs to refactored later and make it optimized, it may have repetition of work
  const format = 'YYYY-MM-DD HH:mm:ss';
  const result = new Date(dayjs(time).format(format)).setFullYear(1900, 0, 1);

  return new Date(dayjs(result).format(format).replace(' ', 'T') + 'Z').toISOString();
};

// Commented bcz of no usage
// const validateTime = (time: string | dayjs.Dayjs | Date | null | undefined): boolean => {
//   if (time === null || time === undefined) return false;
//   const date = toDate(time);
//   const currentDate = new Date();
//   return toMilliseconds(date) <= toMilliseconds(currentDate);
// };

// Commented bcz of no usage
// export const getMaxStartDayObsolete = (personalEfforts: PersonalEffort[]) => {
//   const dateFilter = getDateFilter();
//
//   const personalEffortRecords = personalEfforts
//     .filter((it) => toDate(it.Date) === dateFilter && validateTime(it.Start))
//     ?.sort((a, b) => (toMilliseconds(toDate(a.Start)) > toMilliseconds(toDate(b.Start)) ? 1 : 0));
//
//   if (personalEffortRecords?.length > 0) {
//     let tmp = toDate(personalEffortRecords[0].Start);
//
//     const today = getToday();
//
//     // Add the time component of dtVon to today's date
//     tmp = new Date(
//       today.getTime() +
//         tmp.getHours() * 60 * 60 * 1000 +
//         tmp.getMinutes() * 60 * 1000 +
//         tmp.getSeconds() * 1000 +
//         tmp.getMilliseconds()
//     );
//
//     return tmp;
//   }
//
//   // Get the current date and time
//   const now = new Date();
//
//   // Subtract 10 days from the current date
//   return new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
// };

export const getMaxStartDay = (personalEfforts: PersonalEffort[]) => {
  const datumFilter = convertToUtcDate(getUtcToday());
  const zeitFilter = getUtcToday1900();

  const filteredData = personalEfforts
    .filter(
      (row) =>
        isDefined(row.Date) &&
        convertToUtcDate(row.Date) === datumFilter &&
        isDefined(row.Start) &&
        convertToUtcDateTime(row.Start) <= convertToUtcDateTime(zeitFilter)
    )
    .sort((a, b) => getMillis(b.Start) - getMillis(a.Start));

  if (filteredData.length > 0) {
    const startTime = convertToUtcDateTime(filteredData[0].Start);
    return getUtcAdjustedDateKeepingOriginalTime(startTime);
  }

  return getUtcDateTimeSubtractedByDay(10); // Subtract 10 days
};
