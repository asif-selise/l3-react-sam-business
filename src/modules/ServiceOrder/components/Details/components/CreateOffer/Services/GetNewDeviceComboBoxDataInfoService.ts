import { type GetNewDeviceComboBoxDataInfoParams } from '../Interfaces/ParamsInterfaces/GetNewDeviceComboBoxDataInfoParams';
import { getComboBoxManufacturers } from './GetComboBoxManufacturersService';

export const getNewDeviceComboBoxDataInfo = async (Params: GetNewDeviceComboBoxDataInfoParams) => {
  const oldDeviceTextId = Params.SamOfferOldDeviceTexts.find(
    (iterator) =>
      iterator.SamOfferPropertyId === Params.SamOfferPropertyId &&
      iterator.Text === Params.OldDeviceText
  )?.SamOfferOldDeviceTextId;

  if (!oldDeviceTextId) {
    return null;
  }

  const comboxValues: string[] = [];
  comboxValues.push('');

  if (Params.SamOfferPropertyId === 28) {
    const comboBoxManufacturers = await getComboBoxManufacturers(
      Params.MandantId,
      Params.ProductGroupNumbers,
      Params.Manufacturers
    );

    if (comboBoxManufacturers.length > 0) {
      return comboxValues.concat(comboBoxManufacturers.map((it) => it.NameWithoutNumberAtTheEnd));
    }

    return null;
  }

  // let source: SamOfferNewDeviceText[];

  // if (oldDeviceTextId !== null && oldDeviceTextId !== undefined) {
  const source = Params.SamOfferNewDeviceTexts.filter(
    (iterator) => iterator.OldDeviceTextId === oldDeviceTextId
  );
  // } else if (Params.SamOfferPropertyId === 0) {
  //   source = Params.SamOfferNewDeviceTexts;
  // } else {
  //   source = Params.SamOfferNewDeviceTexts.filter(
  //     (iterator) => iterator.SamOfferPropertyId === Params.SamOfferPropertyId
  //   );
  // }
  source?.sort((a, b) => (a.SortOrder < b.SortOrder ? 1 : 0));

  if (source.length > 0) {
    return comboxValues.concat(source.map((it) => it.Text));
  }
  return null;
};
