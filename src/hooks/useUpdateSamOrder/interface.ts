export interface UpdateSamOrderPayload {
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
  SystemUserWithoutDomain: string;
  SyncDate: string;
}
