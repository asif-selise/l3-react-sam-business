import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueNumber } from '@/src/helpers/generateID';

export const addDetailProductInternal = (
  productId: number,
  samOfferDetailUId: string,
  samOfferDetailId: number,
  quantity: number
) => {
  const detailProduct: SamOfferProductDetail = {
    ProductId: productId,
    Quantity: quantity,
    SamOfferProductDetailId: getUniqueNumber(),
    SamOfferDetailId: samOfferDetailId,
    SamOfferDetailUId: samOfferDetailUId,
    UId: uuidv4(),
    SamOfferUId: '',
  };
  return detailProduct;
};
