import { type DetailGridData } from '../Interfaces/DetailGridData';
import { type GetDetailGridDataParams } from '../Interfaces/ParamsInterfaces/GetDetailGridDataParams';
import { type GetNewDataParams } from '../Interfaces/ParamsInterfaces/GetNewDataParams';
import { type LoadDataParams } from '../Interfaces/ParamsInterfaces/LoadDataParams';
import { getNewData } from './GetNewDataService';
import { loadData } from './LoadDataService';

export const getDetailGridData = async (Params: GetDetailGridDataParams) => {
  let detailGridData: DetailGridData;

  if (Params.IsNewSamOffer) {
    const getNewDataParams: GetNewDataParams = {
      OrderId: Params.OrderId,
      SamOfferId: Params.SamOfferId,
      SamOfferType: Params.SamOfferType ?? -1,
      ServiceOrderDetail: Params.ServiceOrderDetail,
      Manufacturers: Params.Manufacturers,
      SamOfferTypeProperties: Params.SamOfferTypeProperties,
      GeraetDetails: Params.GeraetDetails,
      SetDetailProducts: Params.SetDetailProducts,
      SetDetailItemsByCreation: Params.SetDetailItemsByCreation,
    };
    detailGridData = getNewData(getNewDataParams);
  } else {
    const loadDataParams: LoadDataParams = {
      SamOffer: Params.SamOffer,
      AllSamOfferDetails: Params.AllSamOfferDetails,
      SamOfferProductDetails: Params.SamOfferProductDetails,
      GeraetDetails: Params.GeraetDetails,
      SetDetailProducts: Params.SetDetailProducts,
      SetDetailItemsByCreation: Params.SetDetailItemsByCreation,
    };
    detailGridData = await loadData(loadDataParams);
  }

  return detailGridData;
};
