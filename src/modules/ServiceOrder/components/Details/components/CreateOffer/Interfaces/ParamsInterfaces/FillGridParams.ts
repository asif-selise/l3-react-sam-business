import {
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
  type SamOfferProduct,
  type SamOfferProperty,
  type Manufacturer,
  type SamOfferTypeProperty,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';
import { type Dispatch, type SetStateAction } from 'react';
import { type IDetail } from '../IDetail';

export interface FillGridParams {
  IsNewSamOffer: boolean;
  OrderId: number;
  SamOfferId: number;
  SamOfferType: number;

  // Data lists
  ServiceOrderDetail: ServiceOrderDetail | null;
  Manufacturers: Manufacturer[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
  SamOfferProperties: SamOfferProperty[];
  SamOfferProducts: SamOfferProduct[];
  SamOfferOldDeviceTexts: SamOfferOldDeviceText[];
  SamOfferNewDeviceTexts: SamOfferNewDeviceText[];
  GeraetDetails: GeraetGrupe | null;
  SetGeraetDetails: Dispatch<SetStateAction<GeraetGrupe | null>>;
  DetailItems: IDetail[];
  SetDetailItemsByCreation: Dispatch<SetStateAction<[] | IDetail[]>>;
  SystemUser: string;
}
