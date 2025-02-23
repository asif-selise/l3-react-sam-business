import { getPaginatedProducts } from '@/src/hooks/useGetPaginatedProducts/useGetPaginatedProducts.hook';
import { type EditControl } from '../types';
import {
  type SamOfferDetail,
  type SamOfferProductDetail,
} from '@/src/hooks/useTourData/tourData.interface';

export const RecalcGross = async (
  data: EditControl,
  detailItems: SamOfferDetail[],
  detailProducts: SamOfferProductDetail[]
) => {
  // const quantity = data.Text ? Number(data.Text) : 1;
  let value: number = 0;
  let error = '';

  const detailItem = detailItems.find((it) => it.DetailId === data.DataContext?.DetailId);

  if (!detailItem) {
    error =
      'DetailItem von idSamNoEigenschaft ' +
      data.DataContext?.DetailId +
      ' konnte nicht gefunden werden!';
    return { value: null, error };
  }

  const enumerable = detailProducts.filter(
    (it) => it.SamOfferDetailId === data.DataContext?.DetailId
  );

  if (enumerable.length === 0) {
    return { value: null, error };
  }

  const filteredProductIds = enumerable.map((item) => item.ProductId);
  const searchPIds = filteredProductIds.join(', ');
  const prodItems = await getPaginatedProducts(
    'article',
    1,
    '',
    searchPIds,
    filteredProductIds.length
  );

  for (let i = 0; i < enumerable.length; i++) {
    if (!prodItems?.Data[i].ListPriceExcl) {
      error = 'Preis von idProdukt ' + enumerable[i].ProductId + ' konnte nicht gefunden werden!';
      return { value: null, error };
    }
    value += prodItems.Data[i].ListPriceExcl * Number(enumerable[i].Quantity);
  }

  return { value, error };
};
