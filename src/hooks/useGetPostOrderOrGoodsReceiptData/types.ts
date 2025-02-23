export interface NightDeliveryFilterParams {
  TechnicianEmployeeNumber: number | null;
  SamOrderId?: number | null;
  ManufacturerName?: string | null;
  ManufacturerArticleNumber?: string | null;
  ProductDescription?: string | null;
  OrderId?: number | null;
}

export interface NightDeliveryData {
  isNightOrder: boolean;
  OrderedDate: string | null;
  SamOrderId: number | null;
  OrderId: number | null;
  AppointmentDate: string | null;
  IsWga: boolean;
  ManufacturerId: number | null;
  ManufacturerName: string | null;
  ManufacturerArticleNumber: string | null;
  ProductId: number | null;
  ProductDescription: string | null;
  IsPartialDelivery: boolean | null;
  ListPriceExclTax: number | null;
  DeliveryNumber: string | null;
  OrderedQuantity: number;
  ReceivedQuantity: number;
  DeliveredNumber: number;
  SamOrderDetailId: number | null;
}
