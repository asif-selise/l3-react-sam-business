export interface DeviceInfoFromGuid {
  DeviceId: string | null;
  IsInactive: boolean;
  DiscardedOn: string | null;
  DiscardedBy: string | null;
  ProductId: number | null;
  ManufacturerName: string | null;
  ProductGroup: string | null;
  Model: string | null;
  SerialNumber: string | null;
  ProductNumber: string | null;
  InstallationDate: string | null;
  StreetDisplay: string | null;
  AdditionalStreetDisplay: string | null;
  CodedStreet: string | null;
  ObjectPostalCode: string | null;
  ObjectCity: string | null;
  ObjectRemarks: string | null;
  ManagementId: number | null;
  ManagementAddress: string | null;
  AutoServiceRequestAllowed: boolean | null;
  ClientId: number | null;
  ClientName: string | null;
  ApartmentObjectId: number | null;
  ApartmentCustomerNumber: string | null;
  ApartmentObjectRemarks: string | null;
}
