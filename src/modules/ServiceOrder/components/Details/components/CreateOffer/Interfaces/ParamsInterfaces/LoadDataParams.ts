import {
  type SamOffer,
  type SamOfferDetail,
  type SamOfferProductDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';
import { type Dispatch, type SetStateAction } from 'react';
import type { IDetail } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/IDetail';

export interface LoadDataParams {
  SamOffer: SamOffer | null;
  AllSamOfferDetails: SamOfferDetail[];
  SamOfferProductDetails: SamOfferProductDetail[];
  GeraetDetails: GeraetGrupe | null;
  SetDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
  SetDetailItemsByCreation: Dispatch<SetStateAction<IDetail[] | []>>;
}
