import type { EditControl } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/types';
import type { SamOfferProduct } from '@/src/hooks/useMasterData/masterData.interface';
import type { SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';

export interface GetArticleListParams {
  data: EditControl;
  samOfferProducts: SamOfferProduct[];
  detailProducts: SamOfferProductDetail[];
}
