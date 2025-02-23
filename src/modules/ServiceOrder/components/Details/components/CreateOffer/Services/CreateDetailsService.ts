import { type IDetail } from '../Interfaces/IDetail';
import { type CreateDetailsParams } from '../Interfaces/ParamsInterfaces/CreateDetailsParams';
import { getUniqueNumber } from '@/src/helpers/generateID';
import { v4 as uuidv4 } from 'uuid';

export const createDetails = (Params: CreateDetailsParams) => {
  const manufacturer = Params.Manufacturers.find(
    (it) => it.Id === Params.ServiceOrderDetail?.Manufacturer
  );

  const manufacturerName =
    manufacturer?.NameWithoutNumberAtTheEnd ?? Params.ServiceOrderDetail?.AlternativeManufacturer;

  const typeProperties = Params.SamOfferTypeProperties.filter(
    (it) => it.SamOfferTypeId === Params.SamOfferTypeId
  ).sort((x, y) => (x.SortOrder < y.SortOrder ? 1 : 0));

  const details: IDetail[] = [];

  typeProperties.forEach((typeProperty) => {
    let text = null;

    if (Params.SamOfferTypeId > 10) {
      switch (typeProperty.SamOfferPropertyId) {
        case 28:
          text = manufacturerName;
          break;
        case 29:
          text = Params.ServiceOrderDetail?.ApplianceModel;
          break;
        case 30:
          text = Params.ServiceOrderDetail?.SerialNumber;
          break;
        case 31:
          text = Params.ServiceOrderDetail?.ProductionNumber;
          break;
        case 32:
          text = Params.ServiceOrderDetail?.CommissioningDate;
          break;
        case 37:
        case 43:
        case 49:
        case 59:
        case 65:
        case 76:
          text = Params.ServiceOrderDetail?.Color;
          break;
        case 38:
        case 66:
        case 77:
          text = Params.ServiceOrderDetail?.Bonding;
          break;
        case 44:
          text = Params.ServiceOrderDetail?.InstallationPicture;
          break;
        case 89:
          text = Params.ServiceOrderDetail?.OperatingHours;
          break;
      }
    } else {
      switch (typeProperty.SamOfferPropertyId) {
        case 1:
          text = manufacturerName;
          break;
        case 2:
          text = Params.ServiceOrderDetail?.ApplianceModel;
          break;
        case 3:
          text = Params.ServiceOrderDetail?.SerialNumber;
          break;
        case 4:
          text = Params.ServiceOrderDetail?.ProductionNumber;
          break;
        case 5:
          text = Params.ServiceOrderDetail?.CommissioningDate;
          break;
        case 7:
          text = Params.ServiceOrderDetail?.Color;
          break;
        case 8:
          text = Params.ServiceOrderDetail?.Bonding;
          break;
        case 9:
          text = Params.ServiceOrderDetail?.InstallationPicture;
          break;
      }
    }

    const samOfferDetail: Partial<IDetail> = {
      UId: uuidv4(),
      DetailId: getUniqueNumber(),
      SamOfferId: Params.SamOfferId,
      SamOfferProperty: typeProperty.SamOfferPropertyId,
      SortOrder: typeProperty.SortOrder,
      OldDevice: text?.toString() ?? null,
    };

    details.push(samOfferDetail as unknown as IDetail);
  });

  return details;
};
