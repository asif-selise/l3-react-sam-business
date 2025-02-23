import { type Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';
import { getByManufacturer } from './GetByManufacturerService';

export const getComboBoxManufacturers = async (
  mandantId: number,
  productGroupNumbers: number[],
  manufacturers: Manufacturer[]
) => {
  const source = await getByManufacturer(mandantId, productGroupNumbers, manufacturers);
  const manufacturersWithMandantNull = manufacturers
    .filter((it) => it.By === null)
    .sort((a, b) => (a.NameWithoutNumberAtTheEnd < b.NameWithoutNumberAtTheEnd ? 1 : 0));

  manufacturersWithMandantNull.forEach((element) => {
    source.push(element);
  });

  return source;
};
