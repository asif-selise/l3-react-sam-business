import {
  type SamOfferTypeProperty,
  type Manufacturer,
} from '@/src/hooks/useMasterData/masterData.interface';
import {
  type SamOfferProductDetail,
  type ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';
import type { Dispatch, SetStateAction } from 'react';
import type { IDetail } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/IDetail';

export interface GetNewDataParams {
  OrderId: number;
  SamOfferId: number;
  SamOfferType: number;
  ServiceOrderDetail: ServiceOrderDetail | null;
  Manufacturers: Manufacturer[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
  GeraetDetails: GeraetGrupe | null;
  SetDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
  SetDetailItemsByCreation: Dispatch<SetStateAction<IDetail[] | []>>;
}
