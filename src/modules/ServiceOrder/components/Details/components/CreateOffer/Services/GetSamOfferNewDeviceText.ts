import { type SamOfferNewDeviceText } from '@/src/hooks/useMasterData/masterData.interface';

// GetNeugeraetTextId
export const getSamOfferNewDeviceText = (
  samOfferOldDeviceTextId: number | null,
  samOfferNewDeviceText: string,
  samOfferNewDeviceTexts: SamOfferNewDeviceText[]
) => {
  let source;

  if (samOfferOldDeviceTextId !== null) {
    source = samOfferNewDeviceTexts.find(
      (it) =>
        it.OldDeviceTextId === samOfferOldDeviceTextId &&
        it.Text?.toLocaleLowerCase() === samOfferNewDeviceText?.toLocaleLowerCase()
    );
  } else {
    source = samOfferNewDeviceTexts.find(
      (it) => it.Text?.toLocaleLowerCase() === samOfferNewDeviceText?.toLocaleLowerCase()
    );
  }

  return source;
};
