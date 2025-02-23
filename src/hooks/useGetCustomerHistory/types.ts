export interface CustomerHistoryResponse {
  OrderId: number;
  ManagementId: number;
  CreatedAt: string;
  DocumentDate: string;
  CustomerPhone: string;
  CustomerAddress: string;
  Manufacturer: string;
  ProductGroup: number;
  DeviceModel: string;
  SerialNumber: string;
  ProductNo?: string;
  ProductColor: string;
  Brand?: string;
  OperatingStartDate?: string;
  Status: string;
  Revenue?: number;
  FaultReport: string;
  LastST: string;
  AppointmentDate: string;
  ReportSort1: number;
  ReportSort2: number;
  Street: string;
  PostalCode: string;
}
