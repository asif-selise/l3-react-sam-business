export interface ProductItem {
  Quantity: number;
  Selected: boolean;
  ProductId: number;
  Text: string | null;
  SelectedToEdit: boolean;
  Description: string | null;
}
