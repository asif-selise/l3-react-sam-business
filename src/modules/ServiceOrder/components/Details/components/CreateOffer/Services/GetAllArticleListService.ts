import { getPaginatedProducts } from '@/src/hooks/useGetPaginatedProducts/useGetPaginatedProducts.hook';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type Article } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/Article';

export const getAllArticleListService = async (detailProducts: SamOfferProductDetail[]) => {
  const articles: Article[] = [];

  const productIds = detailProducts.map((product) => product.ProductId);
  const searchPIds = productIds.join(', ');

  const filteredProducts = await getPaginatedProducts(
    'article',
    1,
    '',
    searchPIds,
    productIds.length
  );

  for (const detailProduct of detailProducts) {
    const product = filteredProducts?.Data.find((it) => it.ProductId === detailProduct.ProductId);

    if (!product) {
      const message = `PRODUCT_WITH_ID_COULD_NOT_BE_FOUND`;
      const productId = detailProduct.ProductId;

      return { articles: [], error: { message, productId } };
    }

    const quantity = detailProduct.Quantity ?? 1;
    const totalPrice = product.ListPriceExcl * quantity;

    articles.push({
      Quantity: quantity,
      ArticleNumber: product.ManufacturerArticleNumber,
      Description: product.Description,
      PriceExcl: product.ListPriceExcl,
      TotalPrice: totalPrice,
    });
  }
  return { articles, error: null };
};
