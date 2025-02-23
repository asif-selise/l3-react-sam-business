import type { GeraetGrupe } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/GeraetGrupe';
import type { Dispatch, SetStateAction } from 'react';
import type { SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import type { GeraetItem } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/GeraetItem';
import type { Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';

export interface BaseGeraetParams {
  samOfferDetailUId: string;
  samOfferDetailId: number;
  geraetItem: GeraetItem | null;
  geraetDetails: GeraetGrupe | null;
  setGeraetDetails: Dispatch<SetStateAction<GeraetGrupe | null>>;
  detailProducts: SamOfferProductDetail[];
  setDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
  manufacturers: Manufacturer[];
}
