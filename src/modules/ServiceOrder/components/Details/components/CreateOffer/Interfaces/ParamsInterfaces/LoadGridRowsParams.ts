import {
  type Manufacturer,
  type SamOfferProperty,
  type SamOfferTypeProperty,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type Dispatch, type SetStateAction } from 'react';
import { type IDetail } from '../IDetail';

export interface LoadGridRowsParams {
  IsNewSamOffer: boolean;
  OrderId: number;
  SamOfferId: number;
  SamOfferType: number;
  ServiceOrderDetail: ServiceOrderDetail | null;
  Manufacturers: Manufacturer[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
  SamOfferProperties: SamOfferProperty[];
  DetailItems: IDetail[];
  SetDetailItemsByCreation: Dispatch<SetStateAction<[] | IDetail[]>>;
}
