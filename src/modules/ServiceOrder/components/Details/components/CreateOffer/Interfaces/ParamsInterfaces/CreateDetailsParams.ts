import {
  type Manufacturer,
  type SamOfferTypeProperty,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';

export interface CreateDetailsParams {
  SamOfferId: number;
  SamOfferTypeId: number;
  ServiceOrderDetail: ServiceOrderDetail | null;
  Manufacturers: Manufacturer[];
  SamOfferTypeProperties: SamOfferTypeProperty[];
}
