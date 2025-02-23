import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type ProductItem } from '../Interfaces/ProductItem';

const SaveArticleList = (
  articleList: ProductItem[],
  detailProducts: SamOfferProductDetail[] | null
) => {
  // const updatedDetailProducts: SamOfferProductDetail[] = [];
  // for (let i = 0; i < (detailProducts?.length ?? 0); i++) {
  //   const item = articleList.find((x) => x.ProductId === detailProducts[i].ProductId);
  //   if (item) {
  //     const value: SamOfferProductDetail = {
  //       SamOfferProductDetailId: detailProducts[i].SamOfferProductDetailId,
  //       SamOfferDetailId: detailProducts[i].SamOfferDetailId,
  //       ProductId: detailProducts[i].ProductId,
  //       Quantity: item.Quantity,
  //     };

  //     updatedDetailProducts.push(value);
  //   }
  // }

  let updatedDetailProducts = detailProducts;

  if (articleList?.length > 0 && detailProducts) {
    updatedDetailProducts = detailProducts.map((detailProduct) => {
      for (const article of articleList) {
        if (article.ProductId === detailProduct.ProductId) {
          return { ...detailProduct, Quantity: article.Quantity };
        }
      }

      return detailProduct;
    });
  }

  const count = articleList.filter((article) => article.Quantity > 0)?.length ?? 0;
  let newDeviceAdditionalText: string | null = null;

  if (count === 1) {
    newDeviceAdditionalText = articleList[0].Description;
  } else if (count > 1) {
    newDeviceAdditionalText = count + ' Artikel';
  }

  return { updatedDetailProducts, newDeviceAdditionalText };
};

export default SaveArticleList;
