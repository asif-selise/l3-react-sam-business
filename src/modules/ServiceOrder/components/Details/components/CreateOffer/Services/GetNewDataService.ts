import { type KvNoHeaderNo } from '../Interfaces/KvNoHeaderNo';
import { type GetNewDataParams } from '../Interfaces/ParamsInterfaces/GetNewDataParams';
import { type DetailGridData } from '../Interfaces/DetailGridData';
import { createDetails } from './CreateDetailsService';
import { type CreateDetailsParams } from '../Interfaces/ParamsInterfaces/CreateDetailsParams';

export const getNewData = (Params: GetNewDataParams) => {
  const header: KvNoHeaderNo = {
    OrderId: Params.OrderId,
    SamOfferId: Params.SamOfferId,
    SamOfferType: Params.SamOfferType ?? -1,
  };

  const createDetailsParams: CreateDetailsParams = {
    SamOfferId: Params.SamOfferId,
    SamOfferTypeId: Params.SamOfferType,
    ServiceOrderDetail: Params.ServiceOrderDetail,
    Manufacturers: Params.Manufacturers,
    SamOfferTypeProperties: Params.SamOfferTypeProperties,
  };
  const samOfferDetails = createDetails(createDetailsParams);
  Params.SetDetailItemsByCreation(samOfferDetails);

  const res: DetailGridData = {
    Header: header,
    SamOfferDetails: samOfferDetails,
    SamOfferDetailProducts: [],
    Geraet: Params.GeraetDetails,
  };

  return res;
};
