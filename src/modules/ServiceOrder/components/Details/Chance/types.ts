import { type Dayjs } from 'dayjs';

export interface ServiceOrderComplaintFields {
  ComplaintId: number;
  OrderId: number;
  ManagementId: number;
  ManufacturerId?: number | null;
  ProductGroupId?: number | null;
  ComplaintLevelId?: number | null;
  ComplaintCategoryId?: number | null;
  EntryDateTime: Dayjs | null;
  CompletedOnDateTime: Dayjs | null;
  MustBeCompletedBy: Dayjs | null;
  ReportedBy: string | null;
  MailReceivedOn: Dayjs | null;
  ComplaintDetails: string | null;
  UserCreated: string | null;
  ComplaintRegisteredOn: Dayjs | null;
  UserModified: string | null;
  ComplaintModifiedBy: string | null;
  ComplaintModifiedOn: Dayjs | null;
  LastPrintDate: Dayjs | null;
  Cost?: number | null;
  FaultAttributedTo: string | null;
  WorkflowPoolItemFaultAttributionComplaint?: number | null;
  OpportunityReceivedVia: string | null;
  OpportunityForwardedTo: string | null;
  StopMahnso?: number | null;
  ReasonForPriorRepair: string | null;
}

export interface ServiceOrderComplaintDetailFields {
  ComplaintDetailId: number;
  ComplaintId: number;
  EntryDateTime: Dayjs | null;
  CompletedOnDateTime: Dayjs | null;
  MustBeCompletedByDateTime: Dayjs | null;
  MailReceivedOnDateTime: Dayjs | null;
  Remark: string;
  ChangedByUser: string;
  ChangedDateTime: string;
  DocumentIncludingPath: string;
  Owner: string;
  AvailableLetter: string;
}
