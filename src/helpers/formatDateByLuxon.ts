import type dayjs from 'dayjs';
import { DateTime } from 'luxon';
import { isDefined } from '@/src/helpers/genericFunctions';

const ZONE = 'utc';
type HOUR_FORMAT = '12' | '24';

export const convertToUtcDateTime = (time: string | dayjs.Dayjs) => {
  return DateTime.fromISO(time as string, { zone: ZONE });
};

export const convertFromMillis = (millis: number) => {
  return DateTime.fromMillis(millis, { zone: ZONE });
};

export const getMillis = (time: string | dayjs.Dayjs) => {
  return convertToUtcDateTime(time).toMillis();
};

export const convertToUtcDate = (time: string | dayjs.Dayjs) => {
  return convertToUtcDateTime(time).toISODate();
};

export const convertToUtcFormatedDate = (time: string | dayjs.Dayjs | null) => {
  if (!isDefined(time)) {
    return null;
  }
  return convertToUtcDateTime(time).toFormat('dd.MM.yyyy');
};

export const convertToUtcTime = (time: string | dayjs.Dayjs, hourFormat: HOUR_FORMAT = '12') => {
  const format = hourFormat === '12' ? 'hh:mm a' : 'HH:mm';
  return convertToUtcDateTime(time).toFormat(format);
};

export const isToday = (time: string | dayjs.Dayjs) => {
  return DateTime.now().toUTC().toISODate() === convertToUtcDate(time);
};

export const getUtcToday = () => {
  return DateTime.now().toUTC().toISODate();
};

export const getUtcCurrentDateTime = () => {
  return DateTime.now().toUTC();
};

export const getUtcToday1900 = () => {
  const format = 'yyyy-MM-dd HH:mm:ss';
  return DateTime.now().toUTC().set({ year: 1900, month: 1, day: 1 }).toFormat(format);
};

export const getUtcAdjustedDateKeepingOriginalTime = (time: DateTime) => {
  return DateTime.now().toUTC().set({
    hour: time.hour,
    minute: time.minute,
    second: time.second,
    millisecond: time.millisecond,
  });
};

export const getUtcDateTimeSubtractedByDay = (subtractedDay: number) => {
  return DateTime.now().toUTC().startOf('day').minus(subtractedDay);
};
