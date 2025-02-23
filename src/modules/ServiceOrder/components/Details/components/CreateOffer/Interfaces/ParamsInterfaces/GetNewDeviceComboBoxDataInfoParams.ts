import {
  type Manufacturer,
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';

export interface GetNewDeviceComboBoxDataInfoParams {
  MandantId: number;
  OldDeviceText: string | null;
  ProductGroupNumbers: number[];
  SamOfferPropertyId: number;
  Manufacturers: Manufacturer[];
  SamOfferOldDeviceTexts: SamOfferOldDeviceText[];
  SamOfferNewDeviceTexts: SamOfferNewDeviceText[];
}
