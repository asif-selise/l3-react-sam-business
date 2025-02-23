import { type Dayjs } from 'dayjs';

export interface TimeEntity {
  UId: string;
  TimeId: number;
  OrderId: number;
  NewClientKv: number;
  ExistingClientKv: number;
  OrderNumber: number;
  Date: string;
  FlagTimeId: number;
  TimeSlot: string | null;
}

interface SyncDate {
  UId: string;
  SyncDateTime: string;
  SyncId: string;
}

export interface WorkflowDetail {
  UId: string;
  WorkflowId: number;
  WorkflowItemId: number | null;
  OrderId: number | null;
  WorkflowRemark: string | null;
  WorkflowRemarkAddition: string | null;
  Creator: string | null;
  CreatedAt: string | null;
  Processor: string | null;
  ProcessingTime: string | null;
  LastChangedBy: string | null;
  LastUpdatedAt: string | null;
  DoneOn: string | null;
  DoneBy: string | null;
  DoneFrom: string | null;
  EsoNr1: string | null;
  EsoNr2: string | null;
  EsoText1: string | null;
  EsoText2: string | null;
  JsonData1: string | null;
  JsonData2: string | null;
  Category: string | null;
  WorkflowType: number;
  ItemType: string | null;
  Branch: string | null;
  ScheduledDate: string | null;
  Status: string | null;
  AdministrationId: number | null;
  StatusText: string | null;
  ProductGroupNumber: string | null;
  SORep: string | null;
  CustomerZipCode: string | null;
  CustomerType: string | null;
  Area: string | null;
  CustomerTypeSort: string | null;
  AddCommentBefore: number;
}

interface ServiceOrderLocation {
  UId: string;
  PostalCodeLocationId: number;
  PostalCode: string;
  Location: string;
  PostalCodeLocationDisplay: string;
}

export interface ServiceOrderOverview {
  UId: string;
  TimeId: number;
  DayTime: string;
  Date: string;
  Appointment: string;
  Text: string;
  OrderId: number;
  Status: string;
  ProductGroupNumber: number;
  CustomerName: string;
  CustomerStreet: string;
  CustomerPostalCode: string;
  WorkflowItem_Rs: string | null;
  CustomerOrderNo: number;
  QcpKV: 1 | 0;
  QcpNO: 1 | 0;
  CompletionStatus: string;
  Mat: number | null;
}

export interface ApartmentDetail {
  UId: string;
  ApartmentId: number;
  ApartmentGuid: string;
  CustomerApartmentNumber: string | null;
  OwnerApartmentNumber: string | null;
  Remarks: string | null;
  AdministrationApartmentFloor: number | null;
  AdministrationApartmentDetails: string | null;
  AdministrationId: number;
  OwnerId: number | null;
  OwnerName: string | null;
  AdministrationName: string | null;
  ChangedBy: string | null;
  ChangedOn: string | null;
  ObjectId: number;
  LastTenant: string | null;
  ApartmentNumber: number;
}

export interface ServiceOrderDetail {
  UId: string;
  OrderId: number;
  AlternateOrderNumber: string | null;
  Status: number;
  LanguageCode: string;
  WorkflowItemRs: number | null;
  SO_Rep: number | null;
  Group: string | null;
  IsEB_SO: boolean;
  YourReference: string | null;
  OurReference: string | null;
  Owner: string;
  Administration: number;
  OwnerAdministration: number;
  GVL_Administration: number;
  CustomerFirstName: string;
  CustomerLastName1: string;
  CustomerLastName2: string | null;
  CustomerStreet: string;
  CustomerZipCityId: number;
  CustomerZip: string;
  CustomerCity: string;
  CustomerPhone: string;
  CustomerEmail: string;
  CustomerSMS: string;
  Object: number;
  Branch: string | null;
  ObjectStreetDisplay: string | null;
  ObjectStreetAdditionalDisplay: string | null;
  ObjectZipCity: number;
  ObjectZip: string | null;
  ObjectCity: string | null;
  ObjectApartmentId: string;
  ApartmentFloorAdministration: string | null;
  ApartmentDetailsAdministration: string | null;
  ContactPerson: string | null;
  ContactPersonPhone: string;
  BusinessCustomerPhone: string;
  Manufacturer: number;
  AlternativeManufacturer: string | null;
  ProductGroup: number;
  ApplianceModel: string | null;
  Bonding: string | null;
  InstallationPicture: string | null;
  CommissioningDate: string | null;
  SerialNumber: string | null;
  ProductionNumber: string | null;
  Color: string | null;
  TenantFault: boolean;
  QcptFaultReport: string;
  FaultReport: string;
  FaultReportOrder: string | null;
  FaultReportOrderSupplement: string | null;
  Amount: number;
  CreatedAt: string;
  UpdatedAt: string;
  Cash: boolean;
  TravelAllowancePercentage: number;
  TravelAllowanceName: string;
  AdditionalMinutes: number;
  InvoiceTotal: number;
  IsGVL: boolean;
  GVL_PossibleText: string | null;
  IsAutoChargeAllowed: boolean;
  ProductionDate: string | null;
  OperatingHours: number;
  SAM_Measurement: string | null;
  IsSikoAuthorized: boolean;
  ReferralAdministration: number;
  ExpressServiceStatus: string | null;
  GoogleFormattedAddress: string | null;
  Latitude: number;
  Longitude: number;
  ConfirmedBy: string | null;
  AreaInfo: string;
  HasFixedConnection: boolean;
  IstKrgSo: number;
}

export interface ManagementCompany {
  UId: string;
  AdministrationId: number;
  Name: string;
  ManagementAddress: string | null;
  PhoneNumber: string;
  ImportantMessageFromServiceOrder?: string | null;
  ClientId: number;
}

export interface ClientSetting {
  UId: string;
  ClientSettingId: number;
  ClientId: number;
  SettingKey: string;
  SettingValue: string;
}

interface BranchDetail {
  UId: string;
  IdFile: number;
  FileName: string | null;
  LastRequestStation: number;
  AccountId: number;
  DebtorSubaccount: number;
  BranchNumber: number;
  StoreLocationCounter: number;
  LabelPrinter: string;
  LabelPrinter2: string;
  OnLabelPrinter: string | null;
  ClientBranch: number;
  ActiveBranch: number;
  ShortBranchName: string;
  Latitude: number;
  Longitude: number;
  Object: number;
}

interface ManagementMediation {
  UId: string;
  Id: number;
  ManagedBy: string | null;
  DisplayNameAlternative: string | null;
}

export interface AppointmentType {
  UId: string;
  Id: number;
  Uid: string;
  Description: string;
  Abbreviation: string;
  TimeTrackingType: string;
  ViewMode: string;
  Sorting: number;
}

export interface Appointment {
  AppointmentId: number | null;
  AppointmentNumber: number | null;
  OriginatingSystem: string | null;
  StartDate: string | null;
  StartDateTimeOfDay: string | null;
  EndDate: string | null;
  EndDateTimeOfDay: string | null;
  DaysCount: number;
  Remark: string;
  AccompaniedBy: string | null;
  ApprovalLevel: number;
  IsCompleted: boolean;
  UId: string;
  AppointmentTypeId: number | null;
}

interface DeviceDetail {
  UId: string;
  Id: number;
  DeviceId: number;
  SerialNumber: string;
  ProductNumber: string | null;
  PreferredManufacturerId: number;
  PreferredProductGroupId: number;
  PreferredManufacturer: string;
  PreferredProductGroupText: string;
  ModelPreferred: string;
  ColorPreferred: string;
  BindingPreferred: string;
  LastTenant: string;
  StreetDisplay: string;
  AdditionalStreetDisplay: string;
  City: string;
  ApartmentCustomerNumber: string;
  ApartmentOwnerNumber: string | null;
  ApartmentFloorManagement: string;
  ApartmentDetailsManagement: string;
  RemarksApartmentBuilding: string | null;
  InstallationDate: string | null;
  ManagementAddress: string;
  IsInactive: boolean;
  LastModifiedDate: string | null;
  ConditionManual: number;
  StreetExtra: string | null;
  CityExtra: string | null;
}

export interface OrderDevice {
  UId: string;
  ASAMMeasurement: string | null;
  Binding: string | null;
  Color: string | null;
  DateOfAcceptance: string | null;
  Device: string | null;
  DeviceCondition: string | null;
  ProductId: number | null;
  InstallationDate: string | null | Dayjs;
  ManufacturerId: string | null;
  Manufacturer: string;
  Model: string | null;
  NextOrderId: number;
  OrderId: number;
  OrderDeviceId: number;
  ProductDate: string | null;
  ProductGroup: string;
  ProductGroupId: number;
  ProductNumber: string | null;
  Remarks: string | null;
  SerialNumber: string | null;
  TemporaryApartmentGId: string | null;
  TemporaryObjectId: number;
  ManagementId: number | null;
  DeviceConditionId: number | null;
}

export interface ServiceOrderComplaint {
  UId: string;
  ComplaintId: number;
  OrderId: number;
  ManagementId: number;
  ManufacturerId?: number | null;
  ProductGroupId?: number | null;
  ComplaintLevelId?: number | null;
  ComplaintCategoryId?: number | null;
  EntryDateTime?: string | null;
  CompletedOnDateTime?: string | null;
  MustBeCompletedBy?: string | null;
  ReportedBy: string | null;
  MailReceivedOn?: string | null;
  ComplaintDetails: string | null;
  UserCreated: string | null;
  ComplaintRegisteredOn?: string | null;
  UserModified: string | null;
  ComplaintModifiedBy: string | null;
  ComplaintModifiedOn?: string | null;
  LastPrintDate?: string | null;
  Cost?: number | null;
  FaultAttributedTo: string | null;
  WorkflowPoolItemFaultAttributionComplaint?: number | null;
  OpportunityReceivedVia: string | null;
  OpportunityForwardedTo: string | null;
  StopMahnso?: number | null;
  ReasonForPriorRepair: string | null;
}

export interface ServiceOrderComplaintDetail {
  UId: string;
  ComplaintDetailId: number;
  ComplaintId: number;
  EntryDateTime: string | null;
  CompletedOnDateTime?: string | null;
  MustBeCompletedByDateTime?: string | null;
  MailReceivedOnDateTime?: string | null;
  Remark: string | null;
  ChangedByUser: string;
  ChangedDateTime: string;
  DocumentIncludingPath: string;
  Owner: string;
  AvailableLetter: string;
  OrderId: number;
}

export interface InvoiceDetail {
  UId: string;
  InvoiceDetailId: number;
  OrderId: number;
  Article: string | null;
  Quantity: number;
  Discount1: string | null;
  Discount2: string | null;
  DiscountType: string | null;
  NetAmount: number;
  Code: string | null;
  FixedPrice: number;
  FixedPriceExcl: number;
  Gross: number;
  AutoDiscount: number;
  ArticleNumber: string | null;
  ArticleDescription: string | null;
  CustomerAlteration: string | null;
  Color: string | null;
  Sensitivity: number;
  File: string | null;
  OriginalPriceExclVAT: number;
  OriginalPriceInclVAT: number;
  AdditionalDiscount1: number;
  AdditionalDiscount2: number;
  OriginalSetDiscount: number;
  ManualAdjustment: number;
  PremiumPerUnit: number;
  Weight: number;
  AdjustmentMadeOn: string | null;
  AdjustmentMadeBy: string | null;
  PrintedOn: string | null;
  OrderedOn: string | null;
  ProductType: number;
  ManufacturerId: number;
  ProductGroupId: number;
  ProductId: number;
}

export interface SamKv {
  UId: string;
  CalculationVersion: number | null;
  CreatedAt: string | null;
  ChangedBy: string | null;
  CustomerInformant: string | null;
  CustomerName: string | null;
  LifeTimeTravelCosts: number;
  LifeTimeVisitedWorkingTimeMin2: number | null;
  LifespanOperatingMinutes: number;
  OperatingCosts: number;
  OperatingCostsPerMinute: number;
  OperatingMinutes: number;
  OperatingMinutesInVisit: number | null;
  OrderId: number;
  OrderTakenBy: string | null;
  ProcessingPercentage: number | null;
  ReferralFrom: number | null;
  ReleaseOn: string | null;
  Remarks: string | null;
  TakenOverOn: string | null;
  SamKvId: number;
  SmallClientPercentage: number | null;
  TechnicianId: number;
  UpdatedAt: string | null;
  VatRate: number;
  CustomerInformedBy: string | null;
  CustomerInformedAt: string | null;
  ServiceOrderOfferNotificationId: number | null;
}

export interface SamKvDetail {
  UId: string;
  SamKvUId: string;
  ArticleNumber: string | null;
  ChangedBy: string | null;
  CreatedAt: string | null;
  Description: string | null;
  ProductId: number | null;
  Quantity: number;
  SamKvDetailId: number;
  SamKvId: number;
  TotalCost: number;
  UnitPrice: number;
  UpdatedAt: string | null;
}

export interface SamKvTimeFrame {
  UId: string;
  TimeframeDetailId: number;
  SamKvId: number;
  SamKvTimeframeId: number;
  MinuteRate: number;
  LifespanDuration: number;
}

export interface UsersSamOrder {
  UId: string;
  OrderId: number | null;
  ProductCount: number | null;
  Description: string | null;
  ListPriceIncludingTax: number;
  ListPriceExcludingTax: number;
  RecyclingFee: number;
  WarehouseLocation: number | null;
  DestinationWarehouse: number | null;
  ProductId: number;
  BarcodeRequiredProductType: number;
  IsUsed: boolean;
  IsSet: string | null;
  ManufacturerArticleNumber: string | null;
  OnlyUsedMutatingIsAllowed: boolean;
  IstSWga: number;
}

export interface SamOrder {
  OrderedOn: string;
  OrderId: number;
  SOId: number | null;
  ScheduledDate: string | null;
  QuantityOrdered: number;
  ManufacturerNumber: string;
  ManufacturerName: string | null;
  ManufacturerArticleNumber: string | null;
  ProductDescription: string | null;
  ListPriceExcludingTax: number;
  DeliveryNumber: string | null;
  OrderDetailId: number;
  Booked: boolean;
  ProductId: number;
  ReceivedQuantity: number;
}

export interface TourDataResponse {
  TimeEntities: TimeEntity[];
  SyncDate: SyncDate;
  SyncMessage: string | null;
  TechnicianLogs: any[];
  SamOrders: SamOrder[];
  WorkflowDetails: WorkflowDetail[];
  ServiceOrderLocations: ServiceOrderLocation[];
  ServiceOrderOverviews: ServiceOrderOverview[];
  ApartmentDetails: ApartmentDetail[];
  ServiceOrderDetails: ServiceOrderDetail[];
  SamKvs: SamKv[];
  SamKvDetails: SamKvDetail[];
  SamKvTimeFrames: SamKvTimeFrame[];
  ServiceOrderKVs: any[];
  SamOffers: SamOffer[];
  SamOfferDetails: SamOfferDetail[];
  SamOfferProductDetails: SamOfferProductDetail[];
  TimberOrders: any[];
  TimberOrderDetails: any[];
  TimberOrderDetailPictures: any[];
  InvoiceDetails: InvoiceDetail[];
  ManagementCompanies: ManagementCompany[];
  ServiceOrderManagementCompanies: ServiceOrderManagementCompany[];
  ServiceOrderComplaints: ServiceOrderComplaint[];
  ServiceOrderComplaintDetails: ServiceOrderComplaintDetail[];
  PersonnelEfforts: PersonalEffort[];
  ClientSettings: ClientSetting[];
  BranchDetails: BranchDetail[];
  ManagementMediations: ManagementMediation[];
  AccompaniedTechnicians: any[];
  UsersSamOrders: UsersSamOrder[];
  Offers: Offer[];
  AppointmentTypes: AppointmentType[];
  Appointments: Appointment[];
  AppointmentHistories: any[];
  AdditionalSales: any[];
  DeviceDetails: DeviceDetail[];
  ServiceOrderDeviceInspections: any[];
  QrCodeDetails: QrCodeDetail[];
  ProductQuantityOnOrders: ProductQuantityOnOrder[];
  Clocks: Clocks[];
}

export interface ProductQuantityOnOrder {
  OrderId: number;
  ProductId: number;
  TotalProduct: number;
  UId: string;
  WarehouseLocation: number;
}

export interface Offer {
  SpecialOffer: string | null;
  ErrorReportOffer: string | null;
  ManufacturerId: number | null;
  ProductGroupId: number | null;
  SORep: number | null;
}

export interface WoodOrder {
  UId: string;
  SamOfferUId: string | null;
  OrderId: number;
  WoodOrderId: number;
  Remark: string | null;
  CreatedOn: string | null | Dayjs;
  CreatedBy: string | null;
  ChangedBy: string | null;
  OrderedOn: string | null | Dayjs;
  OrderedBy: string | null;
  SamOfferId: number | null;
  ColorDefinition: string | null;
  WoodOrderManufacturerId: number;
  CompletedOrDeactivated: boolean;
  TechnicianEmployeeNumber: number;
  ManufacturerKitchen: string | null;
  PhotoManufacturerLabelMade: string | null;
}

export interface WoodOrderDetail {
  UId: string;
  WoodOrderId: number;
  WoodOrderUId: string;
  WoodOrderDetailId: number;
  Quantity: number;
  Description: string | null;
  DMassD: number;
  DMassH: number;
  DMassL: number;
  EdgeDetailEdgeColor: string | null;
  EdgeDetailSurfaceColor: string | null;
  Remark: string | null;
  CreatedBy: string;
  ChangedOn: string | null;
  isNew?: boolean;
}

export interface PersonalEffort {
  UId: string;
  PersonalEffortId: number;
  OrderId: number;
  Date: string | Dayjs;
  TechnicianEmployeeNumber: number;
  TechnicianName: string | null;
  Start: Dayjs | string;
  End: Dayjs | string;
  TravelTime?: number | null;
  Code: string | null;
  WorkFromHome: boolean;
  NoSecondWayReason?: number | null;
  CalculatedHW: number | null;
}

export interface InstallationChecklist {
  UId: string;
  ChecklistDataId: number;
  OrderId: number;
  ChecklistId: number;
  Answer: boolean | null;
  ModifiedAt: string;
  ModifiedBy: string;
  ProductGroupId: number;
  Question: string;
  Sorting: number;
  ProductGroupNumber: number;
}

export interface SamOffer {
  UId: string;
  SamOfferId: number;
  OrderId: number;
  TechnicianId: number;
  Vrg: number;
  Takeover: number;
  Installation: number;
  Accessory: number;
  VatRate: number;
  CommentNo: string | null;
  ApprovalDate: string | null;
  TakenOverUser: string | null;
  TakenOverAt: string | null;
  CreatedAt: string | null;
  SamOfferType: number;
  NicheHeight: number | null;
  NicheWidth: number | null;
  NicheDepth: number | null;
  ExternalWidth: number | null;
  ExternalHeight: number | null;
  BaseHeight: number | null;
  NicheBottomHeight: number | null;
  NewOrderOfferABS: number | null;
  UserFromABSCreated: string | null;
  UpdatedAt: string | null;
  ChangedByNo: string | null;
  CutoutWidth: number | null;
  CutoutHeight: number | null;
  LowerHeight: number | null;
  DetailWidth: number | null;
  DetailHeight: number | null;
  Remark: string | null;
  isNewOffer?: boolean;
}

export interface SamOfferDetail {
  UId: string;
  DetailId: number;
  SamOfferUId: string;
  SamOfferId: number;
  SamOfferProperty: number;
  SortOrder: number | null;
  OldDevice: string | null;
  NewDevice: string | null;
  GrossExcl: number | null;
  ModifiedOnDetail: Date | string | null;
  ModifiedByDetail: string | null;
}

export interface SamOfferProductDetail {
  UId: string;
  SamOfferUId: string;
  SamOfferDetailUId: string;
  SamOfferProductDetailId: number;
  SamOfferDetailId: number;
  ProductId: number;
  Quantity: number | null;
}

export interface QrCodeDetail {
  PreferredSourceIsProduct: boolean | null;
  ProductID: number | null;
  SerialNumber: string | null;
  ProductNumber: string | null;
  ManufacturerNumber: number | null;
  ProductGroupNumber: number | null;
  Manufacturer: string | null;
  ProductGroup: string | null;
  Model: string | null;
  Color: string | null;
  PreferredBinding: string | null;
  LastTenant: string | null;
  CustomerStreet: string | null;
  CustomerStreetNumber: string | null;
  CustomerCity: string | null;
  AdministrationApartmentNumber: string | null;
  OwnerApartmentNumber: string | null;
  AdministrationFloor: number | null;
  AdministrationApartmentDetails: string | null;
  ApartmentRemarks: string | null;
  InstallationDate: string | null;
  QrCode: string | null;
  ApartmentID: number | null;
  ObjectID: number | null;
  AdministrationAddress: string | null;
  IsInactive: boolean | null;
  PreferredManufacturerID: number | null;
  PreferredProductGroupID: number | null;
  ManualDeviceCondition: number | null;
}

export interface ServiceOrderManagementCompany {
  AdministrationId: number;
  ManagerOfficeId: number;
  Title: string | null;
  LastName: string | null;
  FirstName: string | null;
  Position: string | null;
  PhoneNumber: string | null;
  Email: string | null;
}

export interface Clocks {
  Id: number;
  Employeeid: number | null;
  Minutes: number | null;
  Clockintimestamp: string | null;
  Clockouttimestamp: string | null;
  Importrowid: number | null;
  Negateminutes: boolean | null;
  Kind: string | null;
  Paidoff: boolean | null;
  Edited: boolean | null;
  Sonumber: number | null;
  Compensated: boolean | null;
}
