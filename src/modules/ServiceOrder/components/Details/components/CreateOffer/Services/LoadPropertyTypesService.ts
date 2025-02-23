import {
  type SamOfferProperty,
  type SamOfferTypeProperty,
} from '@/src/hooks/useMasterData/masterData.interface';
import { type IDefinition } from '../Interfaces/IDefinition';

// LoadEigenschaftTypen()
export const loadPropertyTypes = (
  samOfferTypeId: number,
  samOfferTypeProperties: SamOfferTypeProperty[],
  samOfferProperties: SamOfferProperty[]
) => {
  const filteredSamOfferTypeProperties = samOfferTypeProperties
    .filter((x) => x.SamOfferTypeId === samOfferTypeId)
    .sort((a, b) => (a.SortOrder < b.SortOrder ? 1 : 0));

  const definitions: IDefinition[] = [];

  filteredSamOfferTypeProperties.forEach((row) => {
    const samOfferProperty = samOfferProperties.find(
      (it) => it.SamOfferPropertyId === row.SamOfferPropertyId
    );

    const definition: IDefinition = {
      SamOfferPropertyId: samOfferProperty?.SamOfferPropertyId ?? 0, // idSamNoEigenschaft
      SortOrder: row.SortOrder, // dtSort
      Property: samOfferProperty?.Property ?? 0, // dtEigenschaft
      IsOldDeviceMandatory: samOfferProperty?.IsOldDeviceMandatory ?? false, // dtAltgeraetZwingend
      IsNewDeviceMandatory: samOfferProperty?.IsNewDeviceMandatory ?? false, // dtNeugeraetZwingend
      IsPriceMandatory: samOfferProperty?.IsPriceMandatory ?? false, // dtPreisZwingend
      Group: samOfferProperty?.Group ?? null, // dtGruppe

      SamOfferTypePropertyId: row.SamOfferTypePropertyId, // idSamNoTyp_Eigenschaft
      SamOfferTypeId: row.SamOfferTypeId, // fiSamNoTyp
    };

    definitions.push(definition);
  });

  return definitions;
};
