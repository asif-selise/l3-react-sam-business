import { type GetGeraetListParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/GetGeraetListParams';
import { type GetByGeraeteParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/GetByGeraeteParams';
import { getByGeraete } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/GetByGeraeteService';

export const GetGeraetList = async (params: GetGeraetListParams) => {
  const manufacturerNumber = params.manufacturers.find(
    (it) =>
      it.NameWithoutNumberAtTheEnd?.toLocaleLowerCase() ===
      params.geraetDetails?.ManufactureControlRow?.NewDeviceAdditional?.Text?.toLocaleLowerCase()
  )?.Number;

  const getByGeraeteParams: GetByGeraeteParams = {
    mandantId: params.mandantId,
    productGroupNumbers: params.geraetDetails?.ProductGroupNumbers ?? [],
    manufactureNumber: manufacturerNumber ?? 0,
    hasArticleNumber: false,
    articleNumber: '',
    hasColor: false,
    color: '',
    hashBinding: false,
    binding: '',
    manufacturers: params.manufacturers,
  };
  const geraetItems = await getByGeraete(getByGeraeteParams);

  // TODO
  // ListBoxDataInfo listBoxDataInfo = new ListBoxDataInfo("ProduktId", null, array2);
  // listBoxDataInfo.ItemTemplate = BuildGeraetListBoxTemplate(Geraet.HatBandung);
  // GeraetItem geraetItem = null;
  // KvNoDetailProduktNo gItem = DetailProdukte.FirstOrDefault((KvNoDetailProduktNo i) => i.IsParent(data));
  // if (gItem != null)
  // {
  //     KvNoGeraetNo kvNoGeraetNo = array.FirstOrDefault((KvNoGeraetNo g) => g.ProduktId == gItem.ProduktId.Value);
  //     if (kvNoGeraetNo != null)
  //     {
  //         geraetItem = new GeraetItem(kvNoGeraetNo);
  //         geraetItem.Selected = true;
  //     }
  // }

  // AbsInputBoxDataListBox absInputBoxDataListBox = new AbsInputBoxDataListBox("Wählen Sie ein Gerät aus, indem Sie die betreffende Zeile selektieren:", listBoxDataInfo, "Auswahl Gerät");
  // absInputBoxDataListBox.InputValue = geraetItem;
  // absInputBoxDataListBox.Width = 800.0;
  // bool? flag = ShowInputBox(absInputBoxDataListBox);
  // if (flag.HasValue && flag.Value)
  // {
  //     if (absInputBoxDataListBox.InputValue == null)
  //     {
  //         RemoveGeraet(dataAccessLayer, data);
  //         return;
  //     }

  //     KvNoGeraetNo data2 = ((GeraetItem)absInputBoxDataListBox.InputValue).Data;
  //     AddGeraet(dataAccessLayer, data, data2);
  // }

  const gItem = params.detailProducts.find(
    (it) => it.SamOfferDetailId === params.data.DataContext?.DetailId
  );

  // Select first one as default
  if (gItem && geraetItems) {
    for (const item of geraetItems) {
      if (item.Data.ProductId === gItem.ProductId) {
        item.Data.IsChecked = true;
        break;
      }
    }

    // Alternatively, if you want to use `find` instead:
    // const kvNoGeraetNo = geraetItems.find((it) => it.Data.ProductId === gItem.ProductId);

    // if (kvNoGeraetNo) {
    //   geraetItem = {
    //     Selected: true,
    //     SelectedToEdit: ,
    //     Data: kvNoGeraetNo.Data,
    //   };
    // }
  }

  return geraetItems;
};
