import { type Dayjs } from 'dayjs';
import { type DayPart } from './components/AddAbsenceReport/Types';

export interface CreditTimeRecordingFields {
  CreditReason: string;
  StartDate: Dayjs;
  StartTime: Dayjs;
  EndTime: Dayjs;
}

export interface AbsenceReportFields {
  AppointmentTypeId: number | null;
  StartDate: Dayjs | null;
  StartDateTimeOfDay: DayPart | null;
  IsActivated: boolean | null;
  EndDate: Dayjs | null;
  EndDateTimeOfDay: DayPart | null;
  DaysCount: number;
  Remark: string;
}

export interface AbsenceCreditTimeFilterFields {
  AppointmentTypeId: number | null;
  StartDate: Dayjs | null;
  EndDate: Dayjs | null;
  Remark: string | null;
}

export const CREDIT_TIME_APPOINTMENT_TYPE_ID = 18;
