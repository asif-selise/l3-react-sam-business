import { type Dayjs } from 'dayjs';

interface ApartmentDetail {
  UId: string;
  ApartmentId: number; // ApartmentId
  ApartmentGuid: string; // ApartmentGId
  CustomerApartmentNumber: string | null;
  OwnerApartmentNumber: string | null;
  Remarks: string | null;
  AdministrationApartmentFloor: number | null; // ManagementLevel
  AdministrationApartmentDetails: string | null; // OwnerLevel
  AdministrationId: number; // ManagementApartment
  OwnerId: number | null; // ManagementAdministration
  OwnerName: string | null;
  AdministrationName: string | null; // ManagerName
  ChangedBy: string | null; // OwnerLastName
  ChangedOn: string | null; // LastChangedDate
  ObjectId: number; // ObjectWhg
  LastTenant: string | null;
  ApartmentNumber: number;
}

interface ServiceOrder {
  OrderId: number;
  AlternateOrderNumber: string;
  Status: number;
  LanguageCode: string;
  WorkflowItemRs: number;
  OriginalWorkflowItemRs: number;
  SO_Rep: string;
  Group: string;
  IsEB_SO: boolean;
  YourReference: string;
  OurReference: string;
  Owner: string;
  Administration: number;
  OwnerAdministration: number;
  GvL_Administration: number;
  CustomerFirstName: string;
  CustomerLastName1: string;
  CustomerLastName2: string;
  CustomerStreet: string;
  CustomerZipCityId: number;
  CustomerZip: string;
  CustomerCity: string;
  CustomerPhone: string;
  CustomerEmail: string;
  CustomerSMS: string;
  Object: number;
  Branch: string;
  ObjectStreetDisplay: string;
  ObjectStreetAdditionalDisplay: string;
  ObjectZipCity: number;
  ObjectZip: string;
  ObjectCity: string;
  ObjectApartmentId: string;
  ApartmentFloorAdministration: string;
  ApartmentDetailsAdministration: string;
  ContactPerson: string;
  ContactPersonPhone: string;
  BusinessCustomerPhone: string;
  Manufacturer: number;
  AlternativeManufacturer: string;
  ProductGroup: number;
  ApplianceModel: string;
  Bonding: string;
  InstallationPicture: string;
  CommissioningDate: string;
  SerialNumber: string;
  ProductionNumber: string;
  Color: string;
  TenantFault: boolean;
  FaultReport: string;
  FaultReportOrder: string;
  FaultReportOrderSupplement: string;
  Amount: number;
  CreatedAt: string;
  UpdatedAt: string;
  Cash: boolean;
  TravelAllowancePercentage: number;
  TravelAllowanceName: string;
  AdditionalMinutes: number;
  InvoiceTotal: number;
  IsGVL: boolean;
  GvL_PossibleText: string;
  IsAutoChargeAllowed: boolean;
  ProductionDate: string;
  OperatingHours: number;
  SaM_Measurement: string;
  IsSikoAuthorized: boolean;
  ReferralAdministration: number;
  ExpressServiceStatus: string;
  GoogleFormattedAddress: string;
  Latitude: number;
  Longitude: number;
  ConfirmedBy: string;
  AreaInfo: string;
  HasFixedConnection: boolean;
  IstKrgSo: number;
}

interface SamOrder {
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

interface WorkflowRecord {
  WorkflowId: number;
  WorkflowItemId: number;
  OrderId: number;
  WorkflowRemark: string;
  WorkflowRemarkAddition: string;
  Creator: string;
  CreatedAt: string;
  Processor: string;
  ProcessingTime: string;
  LastChangedBy: string;
  LastUpdatedAt: string;
  DoneOn: string;
  DoneBy: string;
  DoneFrom: string;
  EsoNr1: string;
  EsoNr2: string;
  EsoText1: string;
  EsoText2: string;
  JsonData1: string;
  JsonData2: string;
  Category: string;
  WorkflowType: number;
  ItemType: string;
  Branch: string;
  ScheduledDate: string;
  Status: string;
  AdministrationId: number;
  StatusText: string;
  ProductGroupNumber: string;
  SoRep: string;
  CustomerZipCode: string;
  CustomerType: string;
  Area: string;
  CustomerTypeSort: string;
  AddCommentBefore: number;
}

interface ChecklistRecord {
  ChecklistDataId: number;
  OrderId: number;
  ChecklistId: number;
  Answer: number;
  ModifiedAt: string;
  ModifiedBy: string;
  ProductGroupId: number;
  Question: string;
  Sorting: number;
  ProductGroupNumber: number;
}

interface OrderDeviceRecord {
  ASAMMeasurement: string | null;
  Binding: string | null;
  Color: string | null;
  DateOfAcceptance: string | null;
  Device: string | null;
  DeviceCondition: string | null;
  ProductId: number | null;
  Id: number | string;
  InstallationDate: string | null;
  ManufacturerId: string | null;
  Manufacturer: string;
  Model: string | null;
  NextOrderId: number;
  OrderId: number;
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

interface UsersSamOrder {
  OrderId: number;
  WarehouseLocation: number;
  DestinationWarehouse: number;
  ProductCount: number;
  ProductId: number;
  Description: string;
  ManufacturerPartNumber: string;
  ListPriceExcludingTax: number;
  ListPriceIncludingTax: number;
  RecyclingFee: number;
  BarcodeRequiredProductType: number;
  IsUsed: boolean;
  IsSet: string;
  OnlyUsedMutatingIsAllowed: boolean;
}

interface PersonnelEffortInsert {
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

interface PersonnelEffortUpdate extends PersonnelEffortInsert {}

interface PersonnelEffortDelete extends PersonnelEffortInsert {}

interface ServiceOrderComplaintDetail {
  ComplaintDetailId: number;
  ComplaintId: number;
  EntryDateTime: string;
  CompletedOnDateTime: string;
  MustBeCompletedByDateTime: string;
  MailReceivedOnDateTime: string;
  Remark: string;
  Owner: string | null;
  ChangedByUser: string | null;
  ChangedDateTime: string | null;
  AvailableLetter: string | null;
  DocumentIncludingPath: string | null;
}

interface ServiceOrderComplaint {
  ComplaintId: number;
  OrderId: number;
  ManagementId: number;
  ManufacturerId: number;
  ProductGroupId: number;
  ComplaintLevelId: number;
  ComplaintCategoryId: number;
  EntryDateTime: string;
  CompletedOnDateTime: string;
  MustBeCompletedBy: string;
  ReportedBy: string;
  MailReceivedOn: string;
  ComplaintDetails: string;
  UserCreated: string;
  ComplaintRegisteredOn: string;
  UserModified: string;
  ComplaintModifiedBy: string;
  ComplaintModifiedOn: string;
  LastPrintDate: string;
  Cost: number;
  FaultAttributedTo: string;
  WorkflowPoolItemFaultAttributionComplaint: number;
  OpportunityReceivedVia: string;
  OpportunityForwardedTo: string;
  StopMahnso: number;
  ReasonForPriorRepair: string;
}

interface TechnicianDailyLog {
  HeadTimeId: number;
  Date: string;
  TechnicianId: number;
  TourCompleted: string;
  CallTime: string;
  TimeHeadComment: string;
  TimeHeadCommentST: string;
  Kilometers: number;
  KilometersVerified: boolean;
}

interface WoodOrderDetail {
  UId: string;
  WoodOrderUId: string;
  WoodOrderDetailId: number;
  WoodOrderId: number;
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
}

interface SamKvTimeFrame {
  TimeframeDetailId: number;
  SamKvId: number;
  SamKvTimeframeId: number;
  MinuteRate: number;
  LifespanDuration: number;
}

interface SamKvDetails {
  SamKvDetailId: number;
  SamKvId: number;
  ProductId: number;
  ArticleNumber: string;
  Description: string;
  Quantity: number;
  UnitPrice: number;
  TotalCost: number;
  CreatedAt: string;
  ChangedBy: string;
  UpdatedAt: string;
}

interface SamKv {
  SamKvId: number;
  OrderId: number;
  OperatingCosts: number;
  OperatingMinutes: number;
  LifespanOperatingMinutes: number;
  VatRate: number;
  OperatingCostsPerMinute: number;
  CustomerName: string;
  TechnicianId: number;
  Remarks: string;
  OrderTakenBy: string;
  CreatedAt: string;
  ReferralFrom: number;
  OperatingMinutesInVisit: number;
  SmallClientPercentage: number;
  ProcessingPercentage: number;
  CustomerInformant: string;
  UpdatedAt: string;
  ChangedBy: string;
  LifetimeTravelCosts: number;
  ReleaseOn: string;
  LifetimeVisitedWorkingTimeMin2: number;
  CustomerInformedAt: string;
  CustomerInformedBy: string;
  TakenOverOn: string;
  ServiceOrderOfferNotificationId: number;
  CalculationVersion: number;
  CreatedBy: string;
  RetrievedOn: string;
  LifeTimeTravelCosts: number;
  LifeTimeWorkingTimeInMinutes2: number;
  InformedCustomerName: string;
}

interface SamProductDetails {
  UId: string;
  SamOfferUId: string;
  SamOfferDetailUId: string;
  SamOfferProductDetailId: number;
  SamOfferDetailId: number;
  ProductId: number;
  Quantity: number | null;
}

interface SamNoDetails {
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

interface WoodOrder {
  WoodOrderId: number;
  OrderId: number;
  SamOfferId: number;
  OrderAssemblyDescription: string;
  ManufacturerOfOrderAssembly: string;
  ManufacturerResponsible: number;
  AssemblyStart: string;
  CreatedBy: string;
  UserCreatedBy: string;
  AssemblyStartReal: string;
  UserModifiedBy: string;
  ActiveOrDeactivated: true;
  ColorDefinition: string;
  ManufacturerKitchen: string;
  ManufacturerLabelDone: string;
}

interface SamOffer {
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
}

interface SamOrderWgaUploadOnly {
  UId: string;
  SamOrderWgaUploadOnlyId: number;
  ProductId: number;
  Quantity: number;
  ArticleNumber: string;
  ProductText: string;
  IsSynchronizing: boolean;
}

interface DeviceDiscard {
  DeviceGId: string;
}

interface QRCodeLabelRecord {
  DeviceOldGId: string;
  DeviceNewGId: string;
}

interface Appointment {
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
  AppointmentTypeId: string | null;
}

export interface UpdateAPIData {
  Id: string;
  SystemUserWithoutDomain?: string;
  SyncDate: string;
  TechnicianId: number;
  TechnicianEmployeeNumber: number;
  ApartmentDetailsUpdateRequestModel: {
    InsertRecords: ApartmentDetail[];
    UpdateRecords: ApartmentDetail[];
    // DeleteRecords: DeleteApartment[];
  };
  ServiceOrderDetailsUpdateRequestModel: {
    InsertRecords: ServiceOrder[];
    UpdateRecords: ServiceOrder[];
    // DeleteRecords: DeleteServiceOrder[];
  };
  SamOrdersUpdateRequestModel: {
    InsertRecords: SamOrder[];
    UpdateRecords: SamOrder[];
    DeleteRecords: SamOrder[];
  };
  WorkflowDetailsUpdateRequestModel: {
    InsertRecords: WorkflowRecord[];
    UpdateRecords: WorkflowRecord[];
    DeleteRecords: WorkflowRecord[];
  };
  InstallationChecklistUpdateRequestModel: {
    InsertRecords: ChecklistRecord[];
    UpdateRecords: ChecklistRecord[];
    DeleteRecords: ChecklistRecord[];
  };
  OrderDevicesUpdateRequestModel: {
    InsertRecords: OrderDeviceRecord[];
    UpdateRecords: OrderDeviceRecord[];
    DeleteRecords: OrderDeviceRecord[];
  };
  UsersSamOrdersUpdateRequestModel: {
    InsertRecords: UsersSamOrder[];
    UpdateRecords: UsersSamOrder[];
    // DeleteRecords: {};
  };
  PersonalEffortsUpdateRequestModel: {
    InsertRecords: PersonnelEffortInsert[];
    UpdateRecords: PersonnelEffortUpdate[];
    DeleteRecords: PersonnelEffortDelete[];
  };
  ServiceOrderComplaintDetailsUpdateRequestModel: {
    InsertRecords: ServiceOrderComplaintDetail[];
    UpdateRecords: ServiceOrderComplaintDetail[];
    // DeleteRecords: ;
  };
  ServiceOrderComplaintsUpdateRequestModel: {
    InsertRecords: ServiceOrderComplaint[];
    UpdateRecords: ServiceOrderComplaint[];
    // DeleteRecords: ;
  };
  TechnicianLogsUpdateRequestModel: {
    // InsertRecords: [];
    UpdateRecords: TechnicianDailyLog[];
    // DeleteRecords: ;
  };
  WoodOrderDetailsUpdateRequestModel: {
    InsertRecords: WoodOrderDetail[];
    UpdateRecords: WoodOrderDetail[];
    DeleteRecords: WoodOrderDetail[];
  };
  SamKvTimeFramesUpdateRequestModel: {
    InsertRecords: SamKvTimeFrame[];
    UpdateRecords: SamKvTimeFrame[];
    DeleteRecords: SamKvTimeFrame[];
  };
  SamKvDetailsUpdateRequestModel: {
    InsertRecords: SamKvDetails[];
    UpdateRecords: SamKvDetails[];
    DeleteRecords: SamKvDetails[];
  };
  SamKvsUpdateRequestModel: {
    InsertRecords: SamKv[];
    UpdateRecords: SamKv[];
    DeleteRecords: SamKv[];
  };
  SamOfferProductDetailsUpdateRequestModel: {
    InsertRecords: SamProductDetails[];
    UpdateRecords: SamProductDetails[];
    DeleteRecords: SamProductDetails[];
  };
  SamOfferDetailsUpdateRequestModel: {
    InsertRecords: SamNoDetails[];
    UpdateRecords: SamNoDetails[];
    DeleteRecords: SamNoDetails[];
  };
  WoodOrdersUpdateRequestModel: {
    InsertRecords: WoodOrder[];
    UpdateRecords: WoodOrder[];
    DeleteRecords: WoodOrder[];
  };
  SamOffersUpdateRequestModel: {
    InsertRecords: SamOffer[];
    UpdateRecords: SamOffer[];
    DeleteRecords: SamOffer[];
  };
  SamOrderWgaUploadOnlyUpdateRequestModel: {
    InsertRecords: SamOrderWgaUploadOnly[];
    // UpdateRecords: SamOrderWgaUploadOnly[];
    // DeleteRecords: SamOrderWgaUploadOnly[];
  };
  DeviceDiscardUpdateRequestModel: {
    InsertRecords: DeviceDiscard[];
    // UpdateRecords: {};
    // DeleteRecords: {};
  };
  ReplaceQRCodeLabelUpdateRequestModel: {
    InsertRecords: QRCodeLabelRecord[];
    // UpdateRecords: {};
    // DeleteRecords: {};
  };
  AppointmentsUpdateRequestModel: {
    InsertRecords: Appointment[];
  };
}
