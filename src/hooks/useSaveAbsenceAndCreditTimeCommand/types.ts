export interface ISaveAbsenceAndCreditTimeCommand {
  AppointmentUId: string;
  StartDate: string | null;
  StartDateTimeOfDay: string | null;
  EndDate: string | null;
  EndDateTimeOfDay: string | null;
  DaysCount: number;
  Remark: string | null;
  AccompaniedBy: number | null;
  ApprovalLevel: number | null;
  AppointmentTypeId: number | null;
  SystemUserWithoutDomain: string | null;
  TechnicianEmployeeNumber: number | null;
  IsCompleted: boolean;
  AppointmentHistoryUIds: string[];
  Statuses: string[];
}
