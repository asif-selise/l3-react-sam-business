import {
  type Manufacturer,
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type GridEditControl, type EditControl } from '../../types';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';
import { type Dispatch, type SetStateAction } from 'react';
import { type IDetail } from '../IDetail';

export interface NewDeviceAdditionalTextSelectionChangedParams {
  rowIndex: number;
  addedItem: string | null;
  removedItem: string | null;
  mandantId: number;
  productGroupNumbers: number[];
  manufacturers: Manufacturer[];
  geraete: GeraetGrupe | null;
  setGeraete: Dispatch<SetStateAction<GeraetGrupe | null>>;
  detailItems: IDetail[];
  detailProducts: SamOfferProductDetail[];
  samOfferOldDeviceTexts: SamOfferOldDeviceText[];
  samOfferNewDeviceTexts: SamOfferNewDeviceText[];
  data: EditControl;
  newDeviceAdditionalUpdatedText: string;
  row: GridEditControl;
  tableData: GridEditControl[];
  setTableData: Dispatch<SetStateAction<GridEditControl[] | null>>;
  setDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
}
