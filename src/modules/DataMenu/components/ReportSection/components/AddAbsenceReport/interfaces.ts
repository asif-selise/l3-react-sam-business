export interface CheckNumberOfDaysQueryFields {
  TechnicianEmployeeNumber: number;
  FromDate: string | null;
  FromDateDayPart: string | null;
  ToDate: string | null;
  ToDateDayPart: string | null;
  CountDays: number | null;
}

export interface ICheckNumberOfDaysData {
  Status: boolean;
  Error: string;
}
