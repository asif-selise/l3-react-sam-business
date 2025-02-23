import { type GetOldDeviceComboBoxDataParams } from '../Interfaces/ParamsInterfaces/GetOldDeviceComboBoxDataParams';
import { getComboBoxManufacturers } from './GetComboBoxManufacturersService';

export const getOldDeviceComboBoxData = async (Params: GetOldDeviceComboBoxDataParams) => {
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

  const source = Params.SamOfferOldDeviceTexts.filter(
    (it) => it.SamOfferPropertyId === Params.SamOfferPropertyId
  );

  if (source.length > 0) {
    return comboxValues.concat(source.map((it) => it.Text));
  }
  return null;
};
