export interface IDefinition {
  SamOfferPropertyId: number; // idSamNoEigenschaft
  SortOrder: number; // dtSort
  Property: number | null; // dtEigenschaft
  IsOldDeviceMandatory: boolean; // dtAltgeraetZwingend
  IsNewDeviceMandatory: boolean; // dtNeugeraetZwingend
  IsPriceMandatory: boolean; // dtPreisZwingend
  Group: string | null; // dtGruppe

  SamOfferTypePropertyId: number; // idSamNoTyp_Eigenschaft
  SamOfferTypeId: number; // fiSamNoTyp
}
