export const ViewOrderModals = {
  DataMenuSamOrders: 'dataMenuSamOrders',
} as const;

export interface IDataMenuSamOrdersRequestParams {
  TechnicianEmployeeNumber: number | null;
  WarehouseLocationId: number;
  OrderId: number | string;
  SamOrderId: number | string;
  ManufacturerName: string;
  ManufacturerArticleNumber: string;
  ProductDescription: string;
  BookedState: boolean;
}

export const WAREHOUSE_LOCATION_ID: number = 103;
