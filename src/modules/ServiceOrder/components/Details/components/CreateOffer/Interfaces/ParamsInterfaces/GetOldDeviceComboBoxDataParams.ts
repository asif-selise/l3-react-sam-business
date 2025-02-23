import {
  type Manufacturer,
  type SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';

export interface GetOldDeviceComboBoxDataParams {
  MandantId: number;
  ProductGroupNumbers: number[];
  SamOfferPropertyId: number;
  Manufacturers: Manufacturer[];
  SamOfferOldDeviceTexts: SamOfferOldDeviceText[];
}
