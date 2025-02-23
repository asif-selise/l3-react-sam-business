import { type IDetail } from '../Interfaces/IDetail';

// private void BruttoExkl_Updated(object sender, DataTransferEventArgs e)
export const GetGrossExcl = (detailItems: IDetail[]) => {
  let value = 0;
  detailItems.forEach((element) => {
    value += element.GrossExcl ?? 0;
  });
  return value;
};
