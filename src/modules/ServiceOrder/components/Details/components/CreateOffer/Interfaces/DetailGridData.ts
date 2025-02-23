import {
  type SamOfferDetail,
  type SamOfferProductDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import { type KvNoHeaderNo } from './KvNoHeaderNo';
import { type GeraetGrupe } from './GeraetGrupe';

export interface DetailGridData {
  Header: KvNoHeaderNo | null; // header
  SamOfferDetails: SamOfferDetail[]; // detailItems
  SamOfferDetailProducts: SamOfferProductDetail[]; // detailProdukte
  Geraet: GeraetGrupe | null; // Geraet
}
