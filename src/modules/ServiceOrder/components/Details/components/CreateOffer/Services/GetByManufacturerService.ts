import { type Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';
import { getByGeraete } from './GetByGeraeteService';
import { type GetByGeraeteParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/GetByGeraeteParams';

export const getByManufacturer = async (
  mandantId: number,
  productGroupNumbers: number[],
  manufacturers: Manufacturer[]
) => {
  const getByGeraeteParams: GetByGeraeteParams = {
    mandantId,
    productGroupNumbers,
    manufactureNumber: null,
    hasArticleNumber: false,
    articleNumber: '',
    hasColor: false,
    color: '',
    hashBinding: false,
    binding: '',
    manufacturers,
  };
  const byGeraete = await getByGeraete(getByGeraeteParams);
  const groupedManufacturerNumbers: number[] = [];
  const cache = new Set();

  byGeraete?.forEach((element) => {
    if (!cache.has(element.Data.ManufacturerNumber)) {
      cache.add(element.Data.ManufacturerNumber);
      groupedManufacturerNumbers.push(Number(element.Data.ManufacturerNumber));
    }
  });

  const filteredManufacturers = manufacturers.filter((manufacturerIterator) =>
    groupedManufacturerNumbers.includes(manufacturerIterator.Number)
  );

  return filteredManufacturers;
};
