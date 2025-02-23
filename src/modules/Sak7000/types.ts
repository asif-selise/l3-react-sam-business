export interface ISak7000FilterFields {
  TopRecordNumber: number | string;
  RsLine: boolean;
  Avor: boolean;
  SearchMode: number | string;
  Filter: string;
}

export interface IRsLineFilterFields {
  Challenge: string;
  FromDate: string;
  ToDate: string;
  Remarks: string;
  DoneBy: string;
  ProductGroupNo: number | null;
  OrderNo: number | null;
  ManufacturerNo: number | null;
  RslineId: number | null;
}
