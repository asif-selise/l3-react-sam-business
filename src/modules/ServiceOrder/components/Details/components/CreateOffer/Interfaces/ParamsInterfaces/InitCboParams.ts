import {
  type Manufacturer,
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type EditControl, type GridEditControl } from '../../types';

export interface initCboParams {
  mandantId: number;
  productGroupNumbers: number[];
  manufacturers: Manufacturer[];
  samOfferOldDeviceTexts: SamOfferOldDeviceText[];
  samOfferNewDeviceTexts: SamOfferNewDeviceText[];
  data: EditControl;
  oldDeviceUpdatedText: string;
  row: GridEditControl;
  tableData: GridEditControl[];
}
