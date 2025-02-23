import { type DetailGridData } from '../Interfaces/DetailGridData';
import { type LoadDataParams } from '../Interfaces/ParamsInterfaces/LoadDataParams';
import { v4 as uuidv4 } from 'uuid';

export const loadData = async (Params: LoadDataParams) => {
  const header = Params.SamOffer;
  const samOfferDetails = Params.AllSamOfferDetails.filter(
    (it) => it.SamOfferId === Params.SamOffer?.SamOfferId
  );

  for (const samOfferDetail of samOfferDetails) {
    samOfferDetail.UId = uuidv4();
  }

  Params.SetDetailItemsByCreation(samOfferDetails);
  await new Promise((resolve) => setTimeout(resolve, 10));

  const samOfferDetailProducts = Params.SamOfferProductDetails.filter((it) =>
    samOfferDetails.some((x) => x.DetailId === it.SamOfferDetailId)
  );

  Params.SetDetailProducts(samOfferDetailProducts);
  await new Promise((resolve) => setTimeout(resolve, 10));

  const res: DetailGridData = {
    Header: header,
    SamOfferDetails: samOfferDetails,
    SamOfferDetailProducts: samOfferDetailProducts,
    Geraet: Params.GeraetDetails,
  };

  return res;
};
