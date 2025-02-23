import {
  type SamOfferTypeProperty,
  type Manufacturer,
} from '@/src/hooks/useMasterData/masterData.interface';
import type {
  SamOffer,
  SamOfferDetail,
  SamOfferProductDetail,
  ServiceOrderDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';
import { type Dispatch, type SetStateAction } from 'react';
import { type IDetail } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/IDetail';

export interface GetDetailGridDataParams {
  IsNewSamOffer: boolean;
  OrderId: number;
  SamOfferId: number;
  SamOfferType: number;

  // Datalists
  ServiceOrderDetail: ServiceOrderDetail | null;
  Manufacturers: Manufacturer[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
  SamOffer: SamOffer | null;
  AllSamOfferDetails: SamOfferDetail[];
  SamOfferProductDetails: SamOfferProductDetail[];
  GeraetDetails: GeraetGrupe | null;
  SetDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
  SetDetailItemsByCreation: Dispatch<SetStateAction<IDetail[] | []>>;
}
