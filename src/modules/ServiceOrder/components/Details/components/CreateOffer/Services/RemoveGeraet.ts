import { type RemoveGeraetParams } from '../Interfaces/ParamsInterfaces/RemoveGeraetParams';

export const RemoveGeraet = (params: RemoveGeraetParams) => {
  if (params.geraetDetails) {
    params.setGeraetDetails({
      ...params.geraetDetails,
      ManufactureControlRow: null,
      ModelControlRow: null,
      ColorControlRow: null,
      BindingControlRow: params.geraetDetails.HasBinding
        ? null
        : params.geraetDetails.BindingControlRow,
    });
  }

  // TODO
  // Geraet.Marke.GridRow.DetailItem.Neugeraet = null;
  // Geraet.Modell.GridRow.DetailItem.Neugeraet = null;
  // Geraet.Farbe.GridRow.DetailItem.Neugeraet = null;
  // if (Geraet.HatBandung)
  // {
  //   Geraet.Bandung.GridRow.DetailItem.Neugeraet = null;
  // }
  //
  // data.BruttoExkl = null;

  params.setDetailProducts(
    params.detailProducts.filter((it) => it.SamOfferDetailId !== params.samOfferDetailId)
  );
};
