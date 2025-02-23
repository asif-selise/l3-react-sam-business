import dayjs, { type Dayjs } from 'dayjs';

export const minuteToMilliseconds = 60000;

export const formatDate = (date: Date | Dayjs) => {
  return `${dayjs(date).format('YYYY-MM-DD')}`;
};

// use formatDateByLuxon.convertToUtcFormatedDate if problem occurs due to Utc time zone
export const getDate = (date?: string | null) => {
  if (!date) return null;
  return dayjs(date).format('DD.MM.YYYY');
};

export const getDateTime = (date?: string) => {
  return dayjs(date).format('DD.MM.YYYY hh:mm A');
};

export const formatDetailedDateTime = (date: Date | Dayjs) => {
  return `${dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}`;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-CA');
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${formattedDate}\n${formattedTime}`;
};

export const combineDateTime = (date: dayjs.Dayjs | null, time: dayjs.Dayjs | null) => {
  if (!date || !time) return null;
  return dayjs(date).startOf('day').add(time.hour(), 'hour').add(time.minute(), 'minute');
};

export const getDateTimeWithoutUTC = (date: Dayjs, time: Dayjs) => {
  return new Date(`${date.format('YYYY-MM-DD')}T${time.format('HH:mm')}:00.000Z`).toISOString();
};

export const toShortTime = (date: Dayjs | string | null) => {
  if (!date) return null;

  return new Date(String(date)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const toShortDate = (date: Dayjs | string | null) => {
  if (!date) return null;

  return new Date(String(date)).toLocaleDateString();
};

export const toUTCDateTime = (dateTime: Dayjs | null | string) => {
  // This function solves 1 day lagging issue
  if (!dateTime) return null;

  const localDate = new Date(dayjs(dateTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  ).toISOString();

  return utcDate;
};
