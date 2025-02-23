export interface IDataMenuSamOrdersResponse {
  IsNightOrder: boolean;
  IsBooked: boolean;
  OrderedDate: Date | string;
  OrderId: string | null;
  SamOrderId: number;
  AppointmentDate: Date | null;
  OrderedQuantity: number;
  ReceivedQuantity: number;
  ManufacturerId: number;
  ManufacturerName: string;
  ManufacturerArticleNumber: string;
  ListPriceExclTax: number;
  DeliveryNumber: string;
  SamOrderDetailId: number;
  IsPartialDelivery: boolean;
  ProductId: number;
  ProductDescription: string;
}
