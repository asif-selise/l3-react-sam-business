import { addDetailProductInternal } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/AddDetailProductInternal';
import { type AddGeraetParams } from '../Interfaces/ParamsInterfaces/AddGeraetParams';

export const AddGeraet = (params: AddGeraetParams) => {
  let updatedGeraetDetails = params.geraetDetails;
  let filteredDetailsProduct = params.detailProducts;

  if (!params.geraetItem) return { updatedGeraetDetails, filteredDetailsProduct };

  const record = params.manufacturers.find(
    (it) => it.Number === params.geraetItem?.Data?.ManufacturerNumber
  );

  if (updatedGeraetDetails) {
    if (updatedGeraetDetails.ManufactureControlRow?.NewDeviceAdditional) {
      updatedGeraetDetails = {
        ...updatedGeraetDetails,
        ManufactureControlRow: {
          ...updatedGeraetDetails.ManufactureControlRow,
          NewDeviceAdditional: {
            ...updatedGeraetDetails.ManufactureControlRow.NewDeviceAdditional,
            Text: record?.NameWithoutNumberAtTheEnd ?? '',
          },
        },
      };
    }

    if (updatedGeraetDetails.ModelControlRow?.NewDeviceAdditional) {
      updatedGeraetDetails = {
        ...updatedGeraetDetails,
        ModelControlRow: {
          ...updatedGeraetDetails.ModelControlRow,
          NewDeviceAdditional: {
            ...updatedGeraetDetails.ModelControlRow.NewDeviceAdditional,
            Text: params.geraetItem?.Data?.ArticleNumber ?? '',
          },
        },
      };
    }

    if (updatedGeraetDetails.ColorControlRow?.NewDeviceAdditional) {
      updatedGeraetDetails = {
        ...updatedGeraetDetails,
        ColorControlRow: {
          ...updatedGeraetDetails.ColorControlRow,
          NewDeviceAdditional: {
            ...updatedGeraetDetails.ColorControlRow.NewDeviceAdditional,
            Text: params.geraetItem?.Data?.Color ?? '',
          },
        },
      };
    }

    if (
      updatedGeraetDetails.HasBinding &&
      updatedGeraetDetails.BindingControlRow?.NewDeviceAdditional
    ) {
      updatedGeraetDetails = {
        ...updatedGeraetDetails,
        BindingControlRow: {
          ...updatedGeraetDetails.BindingControlRow,
          NewDeviceAdditional: {
            ...updatedGeraetDetails.BindingControlRow.NewDeviceAdditional,
            Text: params.geraetItem?.Data?.Binding ?? '',
          },
        },
      };
    }
  }
  const source = params.detailProducts.filter(
    (it) => it.SamOfferDetailId === params.samOfferDetailId
  );

  filteredDetailsProduct =
    params.detailProducts.filter(
      (detailProduct) => !source.some((item) => item.ProductId === detailProduct.ProductId)
    ) ?? null;

  const newDetailProduct = addDetailProductInternal(
    Number(params.geraetItem.Data.ProductId),
    params.samOfferDetailUId,
    params.samOfferDetailId,
    1
  );

  filteredDetailsProduct.push(newDetailProduct);

  return { updatedGeraetDetails, filteredDetailsProduct };
};
