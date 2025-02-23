import type { GeraetItem } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/GeraetItem';
import { type BaseGeraetParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/BaseGeraetParams';

export interface SaveGeraetListParams extends BaseGeraetParams {
  geraetItems: GeraetItem[];
}
