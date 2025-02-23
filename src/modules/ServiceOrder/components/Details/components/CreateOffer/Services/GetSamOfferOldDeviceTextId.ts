import { type SamOfferOldDeviceText } from '@/src/hooks/useMasterData/masterData.interface';

// GetAltgeraetTextId
export const getSamOfferOldDeviceTextId = (
  samOfferPropertyId: number,
  text: string,
  samOfferOldDeviceTexts: SamOfferOldDeviceText[]
) => {
  const source = samOfferOldDeviceTexts.find(
    (it) =>
      it.SamOfferPropertyId === samOfferPropertyId &&
      it.Text?.toLocaleLowerCase() === text?.toLocaleLowerCase()
  );
  return source?.SamOfferOldDeviceTextId ?? null;
};
