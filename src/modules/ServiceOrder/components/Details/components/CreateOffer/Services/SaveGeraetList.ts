import { RemoveGeraet } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/RemoveGeraet';
import { type SaveGeraetListParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/SaveGeraetListParams';
import { AddGeraet } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/AddGeraet';

export const SaveGeraetList = (params: SaveGeraetListParams) => {
  if (!params.geraetItem) {
    RemoveGeraet(params);
    return null;
  }
  AddGeraet(params);
};
