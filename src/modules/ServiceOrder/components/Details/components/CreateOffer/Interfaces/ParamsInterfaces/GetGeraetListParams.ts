import type { Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';
import type { EditControl } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/types';
import type { SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type GeraetGrupe } from '../GeraetGrupe';

export interface GetGeraetListParams {
  mandantId: number;
  manufacturers: Manufacturer[];
  data: EditControl;
  geraetDetails: GeraetGrupe | null;
  detailProducts: SamOfferProductDetail[];
}
