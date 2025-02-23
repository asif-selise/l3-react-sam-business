import dayjs, { type Dayjs } from 'dayjs';

export const getDateFromToday = (days: number): Dayjs => {
  const today = dayjs();
  const targetDay = today.add(days, 'day');

  return targetDay;
};

export const getFormattedDate = (date: Dayjs): string => {
  const formattedDate = date.format('YYYY-MM-DD');

  return formattedDate;
};
