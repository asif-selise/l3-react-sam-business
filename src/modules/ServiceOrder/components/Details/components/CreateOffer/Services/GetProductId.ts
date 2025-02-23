import type {
  SamOfferNewDeviceText,
  SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';
import { getSamOfferNewDeviceText } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/GetSamOfferNewDeviceText';
import { getSamOfferOldDeviceTextId } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/GetSamOfferOldDeviceTextId';

export const getProductId = (
  samOfferPropertyId: number,
  samOfferOldDeviceText: string,
  samOfferNewDeviceText: string,
  samOfferOldDeviceTexts: SamOfferOldDeviceText[],
  samOfferNewDeviceTexts: SamOfferNewDeviceText[]
) => {
  const samOfferOldDeviceTextId = getSamOfferOldDeviceTextId(
    samOfferPropertyId,
    samOfferOldDeviceText,
    samOfferOldDeviceTexts
  );
  const samOfferNewDeviceTextEntity = getSamOfferNewDeviceText(
    samOfferOldDeviceTextId,
    samOfferNewDeviceText,
    samOfferNewDeviceTexts
  );

  return samOfferNewDeviceTextEntity?.ProductId ?? null;
};
