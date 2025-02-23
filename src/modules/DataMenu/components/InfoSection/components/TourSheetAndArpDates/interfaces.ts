import { type Dayjs } from 'dayjs';

export interface TourSheetAndArpDatesQueryFields {
  FromDate: Dayjs | null;
  ToDate: Dayjs | null;
}

export interface ITourSheetAndArpDatesData {
  Day: string;
  Date: string;
  Status: string;
  Text: string;
  IsRouteSheet: boolean;
  IsARP: boolean;
}
