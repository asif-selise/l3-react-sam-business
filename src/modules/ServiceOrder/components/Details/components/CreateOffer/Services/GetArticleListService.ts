import { type GetArticleListParams } from '../Interfaces/ParamsInterfaces/ArticleClickParams';
import { type ProductItem } from '../Interfaces/ProductItem';
import { getPaginatedProducts } from '@/src/hooks/useGetPaginatedProducts/useGetPaginatedProducts.hook';

export const getArticleList = async (params: GetArticleListParams) => {
  // enumerable
  const filteredProductIds = params.samOfferProducts
    .filter((product) => product.SamOfferPropertyId === params.data.DataContext?.SamOfferProperty)
    .map((product) => product.ProductId);

  const searchPIds = filteredProductIds.join(', ');

  const prodItems = await getPaginatedProducts(
    'article',
    1,
    '',
    searchPIds,
    filteredProductIds.length
  );

  // enumerable2
  const detailProducts = params.detailProducts.filter(
    (it) => it.SamOfferDetailId === params.data.DataContext?.DetailId
  );

  const productItems: ProductItem[] = [];

  if (prodItems?.Data) {
    prodItems.Data.forEach((prodItem) => {
      const detailProduct = detailProducts.find((x) => x.ProductId === prodItem.ProductId);
      const currentProductItem: ProductItem = {
        Quantity: 0,
        Selected: false,
        SelectedToEdit: false,
        ProductId: prodItem.ProductId,
        Text: prodItem.Description + ', Nr. ' + prodItem.ManufacturerArticleNumber, // Text => Bezeichnung + ", Nr. " + ArtikelNr;,
        Description: prodItem.Description,
      };

      if (detailProduct !== null) {
        currentProductItem.Quantity = detailProduct?.Quantity ?? 0;
      } else {
        const dataRow = params.samOfferProducts.find(
          (x) =>
            x.SamOfferPropertyId === params.data.DataContext?.SamOfferProperty &&
            x.ProductId === prodItem.ProductId
        );

        if (dataRow !== null) {
          currentProductItem.Quantity = dataRow?.Quantity ?? 0;
        }
      }
      currentProductItem.Selected =
        detailProducts.find((x) => x.ProductId === currentProductItem.ProductId) !== null;
      productItems.push(currentProductItem);
    });
  }

  // Build Article List Box Template
  const list: ProductItem[] = [];

  if (detailProducts?.length > 0) {
    detailProducts.forEach((prod) => {
      const productItem = productItems.find((x) => x.ProductId === prod.ProductId);

      if (productItem) {
        list.push(productItem);
      }
    });
  }

  return list;
};
