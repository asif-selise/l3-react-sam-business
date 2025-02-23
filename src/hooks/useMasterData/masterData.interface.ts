/* eslint-disable @typescript-eslint/no-empty-interface */
export interface QrptCurrentDefaultSettings {
  Vat: number;
  LargeDevicePriceInMinutes: number;
  FlatRateAmount: number;
  SmallPartsPercentage: number;
  ETProcessingPercentage: number;
  AdditionalMinutesForGroupS: number;
  MaximumMinuteInKVForFirstVisit: number;
  InternetPassword: string;
}

export interface TempTechnician {
  Id: number;
  TechnicianEmployeeNumber: number;
  Name: string;
  FirstName: string;
  IsTechnician: boolean;
  IsInstaller: boolean;
  Branch: number;
  IsInactive: boolean;
  SystemUserWithoutDomainT: string | null;
  FullName: string;
}

export interface IPrintTableData {
  TourDate: string;
  Orders: number;
  TechnicianEmployeeNumber: number;
  FirstName: string;
  LastName: string;
  IsTechnician: boolean;
  IsInstaller: boolean;
  BranchLocation: string;
  LoadingLocation: string;
  Print: boolean;
}

export interface OrderStatus {
  Id: number;
  Status: string;
  StatusDescription: string;
  IsAfterClearingBlock: boolean;
  IsOrderAllowed: boolean;
}

export interface Branch {
  Id: number;
  Number: number;
  Name: string;
}

export interface WoodOrderManufacturer {
  Id: number;
  BranchNumber: number;
  Address: string;
  Email: string;
  IsActive: boolean;
}

export interface WorkflowItemDD {
  Id: number;
  Item: string;
  IsActive: boolean;
}

export interface WorkflowItem {
  Id: number;
  Item: string;
  IsActive: boolean;
  Type: number;
  SubType: number | null;
  HasNewEsoAdvertisementsAfterClosing: boolean;
  IsNewCreatiedItemAllowed: boolean;
  Admin: number;
  AllocatedItems: number;
  PersItemTakeover: number;
  TypeItem: string;
  SamEsoFollowers: number;
}

interface WorkflowItemFollower {
  Predictor: number;
  Follower: number;
}

interface LoginRequired {
  SystemUserWithoutDomain: string;
  FullName: string;
}

export interface Manufacturer {
  Id: number;
  Number: number;
  Name: string | null;
  By: number | null;
  NameWithoutNumberAtTheEnd: string;
  NameWithNumberAtTheEnd: string;
}

export interface ProductGroup {
  Id: number;
  Number: number;
  Description: string;
  WithdrawalAmount: number;
  DescriptionWithPgNumberAtEnd: string;
}

interface ProductType {
  Id: number;
  Type: string;
}

export interface SamOfferType {
  SamOfferTypeId: number;
  SortOrder: number;
  Type: string;
  IsInactive: boolean;
}

export interface SamOfferTypeProperty {
  SamOfferTypePropertyId: number;
  SamOfferTypeId: number;
  SamOfferPropertyId: number;
  SortOrder: number;
}

export interface SamOfferProperty {
  SamOfferPropertyId: number;
  SortOrder: number;
  Property: number | null;
  IsOldDeviceMandatory: boolean;
  IsNewDeviceMandatory: boolean;
  IsPriceMandatory: boolean;
  Group: string | null;
}

export interface SamOfferOldDeviceText {
  SamOfferOldDeviceTextId: number;
  SamOfferPropertyId: number;
  Text: string;
  IsNewDeviceMandatory: boolean;
  IsRemarkMandatory: boolean;
  SortOrder: number;
}

export interface SamOfferNewDeviceText {
  SamOfferNewDeviceTextId: number;
  SamOfferPropertyId: number;
  OldDeviceTextId: number | null;
  Text: string;
  SortOrder: number;
  ProductId: number | null;
  ProductQuantity: number | null;
}

export interface SamOfferProduct {
  SamOfferProductId: number;
  SamOfferPropertyId: number;
  ProductId: number;
  Quantity: number;
}

export interface WarehouseLocation {
  WarehouseLocationId: number;
  IsOffice: boolean;
  QCPTStorageLocationDetailedIncludingBusinessLocation: string;
  TechnicianEmployeeNumber: number | null;
  IsWaterAndGasConnected: boolean;
  IsActive: boolean;
  IsSamSourceOfSupply: boolean;
}

export interface SamTarget {
  SamTargetId: number;
  Task: string;
  UseAtOffAbs: boolean;
  UseOnNewProduct: boolean;
  ToKDCalculate: boolean;
  SortOrder: number;
  WarehouseLocation: string | null;
  IsActive: boolean;
}

export interface FaultComplain {
  FirstName: string | null;
  LastName: string | null;
  IsInactive: boolean;
  SystemUserWithoutDomain: string | null;
  Group: string | null;
  QCPTDisplay: string;
}

export interface LevelComplain {
  Id: number;
  Level: string;
}

export interface CategoryComplain {
  Id: number;
  Category: string;
}

interface Language {
  Name: string;
}

export interface AutoText {
  Id: number;
  Group: number;
  SubGroup: number | null;
  Name: string;
  NameInGerman: string;
}

interface AutoTextFs {
  Id: number;
  Group: number;
  SubGroup: number | null;
  Name: string;
  NameInGerman: string;
}

export interface CurrentUserRightToFrontendAll {
  RightToFrontendUser: string | null;
}

interface CurrentUserLoginInformation {}

interface CurrentUserTempTechnician {}

interface Login {
  Id: number;
  SystemUserWithoutDomain: string;
  QCPTName: string;
  FirstName: string;
  LastName: string;
  GroupText: string | null;
  DefaultBranch: number;
  ChosenBranch: number;
  AdditionalGroup: string | null;
  ProductGroupPrice: number | null;
  IsInactive: boolean;
  Salutation: number;
  SupervisorsMailingGroup: string | null;
  MaNumber: number;
  ExclusiveClient: string | null;
  Mandant: number;
  CtxTelnr: string | null;
}

interface SamMeasurement {}

interface SamKvTimeStructure {
  Id: number;
  ProductGroup: number | null;
  Task: string;
  ReferenceTimeMin: number;
}

interface ManufacturerWithoutAddressSparePartAccessory {
  ManufacturerNumber: number;
}

export interface SamCheckListInstallation {
  Id: number;
  ProductGroup: number;
  ProductGroupName: string;
  Question: string;
  SortOrder: number;
  ActiveTo: string | null;
  ProductGroupNumber: number;
  IsCheckQuestionActiveInS7000: boolean;
  IsCheckQuestionActiveInSchubiger: boolean;
}

interface SamCheckListInstallationExcludedWorkflowItem {
  WorkflowItem: number;
}

interface FullTextSystemStopWord {
  StopWord: string;
}

interface SamAdditionalSaleProduct {
  Id: number;
  Product: number;
  Remark: string | null;
  ActiveTo: string;
  Rv: string;
  ProductId: number;
  ManufacturerTypeNumber: string;
  Description: string;
  LastPrice: number;
  ProductType: string | null;
}

interface SamAdditionalSaleType {
  Id: number;
  Type: string;
}

interface SamAdditionalSalesFlatRateShipping {
  Id: number;
  Bill: number;
  FlatRateShipping: number;
}

interface Salutation {
  Id: number;
  Name: string;
}

export interface ApartmentNotAllowedAdministration {
  Administration: number;
}

interface StandardWaterAndGasConnection {}

interface DeviceCondition {
  Id: number;
  Condition: string;
  DisplayIdCondition: string;
}

export interface SamKvAutoCalculation {
  Id: number;
  Version: number;
}

export interface SamKvAutoCalculationPG {
  Id: number;
  SamKvAutoCalculation: number;
  ProductGroup: number | null;
}

interface CurrentUserWaterAndGasConnection {}

export interface SamKvAutoCalculationPGFactor {
  Id: number;
  SamKvAutoCalculationPGId: number;
  SamKvAutoCalculationFactorId: number;
}

export interface SamKvAutoCalculationFactor {
  Id: number;
  Area: string;
  FromAccount: number | null;
  ToAccount: number | null;
  Factor: number;
}

export interface SamPrinter {
  Id: number;
  Branch: number;
  Display: string;
  Name: string;
  IsActive: boolean;
}

export interface NoSecondCourseReasons {
  Id: number;
  IsActive: boolean;
  Reason: string;
  Sort: number;
}

export interface Products {
  Description: string;
  ListPriceExcl: number;
  Manufacturer: string;
  Color: string;
  Binding: string;
  ListPriceIncl: number;
  RecyclingFee: number;
  Type: string;
  ManufacturerNumber: number;
  ProductGroupNumber: number;
  IsBargain: boolean;
  ModifiedAt: string;
  DisplayArticleNumber: string;
  ArticleNumberWithoutSpecialChars: string;
  ProductId: number;
  ProductType: number;
  ManufacturerId: number;
  ProductGroup: number;
  ProductGroupText: string;
  IsActive: boolean;
  EKPrice?: number;
  ManufacturerArticleNumber: string;
}

export interface WorkflowItemRelation {
  Predecessor: number;
  Successor: number;
}

export interface MasterData {
  QrptCurrentDefaultSettings: QrptCurrentDefaultSettings[];
  TempTechnicians: TempTechnician[];
  OrderStatusList: OrderStatus[];
  Branches: Branch[];
  WoodOrderManufacturers: WoodOrderManufacturer[];
  WorkflowItemDDs: WorkflowItemDD[];
  WorkflowItemRelations: WorkflowItemRelation[];
  WorkflowItems: WorkflowItem[];
  WorkflowItemFollowers: WorkflowItemFollower[];
  LoginRequiredList: LoginRequired[];
  Manufacturers: Manufacturer[];
  ProductGroups: ProductGroup[];
  ProductTypes: ProductType[];
  SamOfferTypes: SamOfferType[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
  SamOfferProperties: SamOfferProperty[];
  SamOfferOldDeviceTexts: SamOfferOldDeviceText[];
  SamOfferNewDeviceTexts: SamOfferNewDeviceText[];
  SamOfferProducts: SamOfferProduct[];
  WarehouseLocations: WarehouseLocation[];
  SamTargets: SamTarget[];
  FaultComplains: FaultComplain[];
  LevelComplains: LevelComplain[];
  CategoryComplains: CategoryComplain[];
  Languages: Language[];
  AutoTexts: AutoText[];
  AutoTextFsList: AutoTextFs[];
  CurrentUserRightToFrontendAlls: CurrentUserRightToFrontendAll[];
  CurrentUserLoginInformations: CurrentUserLoginInformation[];
  CurrentUserTempTechnicians: CurrentUserTempTechnician[];
  Logins: Login[];
  SamMeasurements: SamMeasurement[];
  SamKvTimeStructures: SamKvTimeStructure[];
  ManufacturerWithoutAddressSparePartAccessoriesList: ManufacturerWithoutAddressSparePartAccessory[];
  SamCheckListInstallations: SamCheckListInstallation[];
  SamCheckListInstallationExcludedWorkflowItemList: SamCheckListInstallationExcludedWorkflowItem[];
  FullTextSystemStopWords: FullTextSystemStopWord[];
  SamAdditionalSaleProducts: SamAdditionalSaleProduct[];
  SamAdditionalSaleTypes: SamAdditionalSaleType[];
  SamAdditionalSalesFlatRateShippings: SamAdditionalSalesFlatRateShipping[];
  Salutations: Salutation[];
  ApartmentNotAllowedAdministrations: ApartmentNotAllowedAdministration[];
  StandardWaterAndGasConnections: StandardWaterAndGasConnection[];
  DeviceConditions: DeviceCondition[];
  SamKvAutoCalculations: SamKvAutoCalculation[];
  SamKvAutoCalculationPGs: SamKvAutoCalculationPG[];
  CurrentUserWaterAndGasConnections: CurrentUserWaterAndGasConnection[];
  SamKvAutoCalculationPGFactors: SamKvAutoCalculationPGFactor[];
  SamKvAutoCalculationFactors: SamKvAutoCalculationFactor[];
  SamPrinters: SamPrinter[];
  NoSecondCourseReasons: NoSecondCourseReasons[];
  Products: Products[];
}

export interface WoodOrderColorDefinition {
  Sort?: number;
  ColorDefinition: number | null;
}

export interface WoodOrderManufacturerKitchen {
  Sort: number | null;
  ManufacturerKitchen: string | null;
}

export interface WoodOrderManufacturerLabelPhoto {
  Sort: number | null;
  ManufacturerLabelPhoto: number | string | null;
}
