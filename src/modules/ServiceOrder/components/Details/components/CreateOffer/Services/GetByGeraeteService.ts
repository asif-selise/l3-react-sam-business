import { type GetByGeraeteParams } from '../Interfaces/ParamsInterfaces/GetByGeraeteParams';
import { type GeraetItem } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/GeraetItem';
import { type KvNoGeraetNo } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/KvNoGeraetNo';
import { getProducts } from '@/src/hooks/useGetProducts/useGetProducts.hook';

// export const getByGeraete = (
//   mandantId: number,
//   productGroupNumbers: number[],
//   manufacturers: Manufacturer[],
//   products: Products[]
// ) => {
//   let filteredProducts = products.filter(
//     (it) =>
//       it.ProductType === 2 &&
//       it.IsActive &&
//       it.ManufacturerNumber < 1000 &&
//       !it.Description.toLowerCase().includes('leihgerät')
//   );

//   if (productGroupNumbers.length > 0) {
//     filteredProducts = filteredProducts.filter((it) =>
//       productGroupNumbers.includes(Number(it.ProductGroupNumber))
//     );
//   }

//   const filteredManufacturers = manufacturers.filter(
//     (manufacturerIterator) => manufacturerIterator.By === mandantId
//   );

//   filteredProducts = filteredProducts.filter((productIterator) =>
//     filteredManufacturers.some(
//       (manufacturerIterator) => manufacturerIterator.Number === productIterator.ManufacturerNumber
//     )
//   );

//   return filteredProducts;
// };

export const getByGeraete = async (params: GetByGeraeteParams) => {
  let sortedProductGroupNumbers: number[] = [];
  let sortedManufacturesNumber: number[] = [];
  let sortedManufacturerArticleNumber: string[] = [];
  let sortedColor: string = '';
  let sortedSetBindingAsNull: boolean = true;
  let sortedBinding: string | null = null;

  if (params.productGroupNumbers.length > 0) {
    sortedProductGroupNumbers = params.productGroupNumbers;
  }

  if (params.manufactureNumber) {
    sortedManufacturesNumber.push(params.manufactureNumber);
  }

  if (params.hasArticleNumber) {
    sortedManufacturerArticleNumber = [...sortedManufacturerArticleNumber, params.articleNumber];
  }

  if (params.hasColor && params.color && params.color.length > 0) {
    sortedColor = params.color;
  }

  if (params.hashBinding) {
    if (!params.binding || params.binding.length !== 0) {
      sortedSetBindingAsNull = false;
      sortedBinding = params.binding;
    }
  }

  const filteredManufacturersNumber = params.manufacturers
    .filter((manufacturer) => manufacturer.By === params.mandantId)
    .map((manufacturer) => manufacturer.Number);

  sortedManufacturesNumber = [...sortedManufacturesNumber, ...filteredManufacturersNumber];

  const sortedProductInfo = {
    ProductGroupNumbers: sortedProductGroupNumbers,
    ManufacturerNumbers: sortedManufacturesNumber,
    ManufacturerArticleNumbers: sortedManufacturerArticleNumber,
    Color: sortedColor,
    SetBindingAsNull: sortedSetBindingAsNull,
    Binding: sortedBinding,
  };

  try {
    const source = await getProducts(sortedProductInfo);

    const result: GeraetItem[] = [];

    if (source) {
      source.forEach((ele) => {
        const item: KvNoGeraetNo = {
          ProductId: ele.ProductId,
          ArticleNumber: ele.ManufacturerArticleNumber,
          Description: ele.Description,
          PriceExclude: ele.ListPriceExcl,
          ManufacturerNumber: ele.ManufacturerNumber,
          ProductGroupNumber: ele.ProductGroupNumber,
          Color: ele.Color,
          Binding: ele.Binding,
          IsChecked: false,
        };
        const gitem: GeraetItem = {
          Selected: false,
          Data: item,
        };
        result.push(gitem);
      });
    }

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Product fetching error:', error);
  }
};
export type { KvNoGeraetNo };
