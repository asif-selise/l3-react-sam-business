export interface IGetProductsPayload {
  ProductGroupNumbers: number[];
  ManufacturerNumbers: number[];
  ManufacturerArticleNumbers: string[];
  Color: string;
  SetBindingAsNull: boolean;
  Binding: string | null;
}
