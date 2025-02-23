import { type SamOfferDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type KvNoDetailGridRowNo } from '../Interfaces/KvNoDetailGridRowNo';
import { type PartKind } from '../types';
import { type SamOfferProperty } from '@/src/hooks/useMasterData/masterData.interface';

export const getInputModeFlags = (
  gridRow: KvNoDetailGridRowNo,
  part: PartKind,
  previousGridRows: KvNoDetailGridRowNo[],
  samOfferProperties: SamOfferProperty[]
) => {
  let isRequired = false;

  if (part === 'Altgeraet') {
    if ([69, 87].includes(Number(gridRow.definition.SamOfferTypeId))) {
      const controlsRow = previousGridRows.find((it) => it.definition.SamOfferTypeId === 68);
      isRequired = isRequiredOfferCashierSystem(controlsRow?.detailItem);
      return isRequired;
    }
    if (gridRow.definition.SamOfferTypeId === 88) {
      const controlsRow = previousGridRows.find((it) => it.definition.SamOfferTypeId === 68);
      isRequired = isRequiredCardSystemOk(controlsRow?.detailItem);
      return isRequired;
    }
  }

  let flag: boolean;
  // const samOfferProperty = samOfferProperties.find(
  //   (it) => it.SamOfferPropertyId === gridRow.definition.Property
  // );

  switch (part) {
    case 'Altgeraet':
      flag = gridRow.definition?.IsOldDeviceMandatory ?? false;
      break;
    case 'Neugeraet':
      flag = gridRow.definition?.IsNewDeviceMandatory ?? false;
      break;
    case 'Preis':
      flag = gridRow.definition?.IsPriceMandatory ?? false;
      break;
    default:
      // throw new Error(`WrongEnumException: Unknown part kind - ${part}`);
      throw new Error(`WrongEnumException: Unknown part kind - `);
  }

  return flag;
};

// IsRequiredKeinKassiersystem
const isRequiredOfferCashierSystem = (data?: SamOfferDetail) => {
  return data?.SamOfferProperty === 68 && data?.OldDevice?.toLowerCase() !== 'keines vorhanden';
};

// IsRequiredCardsystemOk
const isRequiredCardSystemOk = (data?: SamOfferDetail) => {
  return !!(
    data?.SamOfferProperty === 68 &&
    data?.OldDevice?.toLowerCase().includes('cardsystem') &&
    data?.NewDevice?.toLowerCase() !== 'vorhandene karten sind i.o.'
  );
};
