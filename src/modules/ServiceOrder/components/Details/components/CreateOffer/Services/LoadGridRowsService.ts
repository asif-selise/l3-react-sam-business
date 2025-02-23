import { type KvNoDetailGridRowNo } from '../Interfaces/KvNoDetailGridRowNo';
import { type LoadGridRowsParams } from '../Interfaces/ParamsInterfaces/LoadGridRowsParams';
import { loadPropertyTypes } from './LoadPropertyTypesService';

export const loadGridRows = (Params: LoadGridRowsParams) => {
  const definitions = loadPropertyTypes(
    Params.SamOfferType,
    Params.SamOfferTypeProperties,
    Params.SamOfferProperties
  );

  const result: KvNoDetailGridRowNo[] = new Array(definitions.length);

  for (let i = 0; i < definitions.length; i++) {
    const detailItem = Params.DetailItems.findLast(
      (it) =>
        it.SamOfferProperty === definitions[i].SamOfferPropertyId &&
        (!Params.IsNewSamOffer ? it.SamOfferId === Params.SamOfferId : true)
    );

    if (!detailItem) {
      return {
        result: [],
        error: `'DetailItem mit idSamEigenschaft ' +
          ${definitions[i].SamOfferTypeId}+
          ' konnte nicht gefunden werden!'`,
      };
    }

    result[i] = { definition: definitions[i], detailItem };
  }

  return { result, error: '' };
};
