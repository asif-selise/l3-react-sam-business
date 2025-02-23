import { type NewDeviceAdditionalTextSelectionChangedParams } from '../Interfaces/ParamsInterfaces/NewDeviceAdditionalTextSelectionChangedParams';
import { getByGeraete } from './GetByGeraeteService';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import { getProductId } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/GetProductId';
import { type GetByGeraeteParams } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ParamsInterfaces/GetByGeraeteParams';
import {
  type GridEditControl,
  type EditControl,
} from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/types';
import { AddGeraet } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Services/AddGeraet';
import { v4 as uuidv4 } from 'uuid';
import { getUniqueNumber } from '@/src/helpers/generateID';
import { updateGrossExcl } from './updateGrossExcl';

const IsRequiredCardsystemOk = (data: EditControl, neugeraet: string) => {
  return (
    data.DataContext?.SamOfferProperty === 68 &&
    data.DataContext.OldDevice?.toLocaleLowerCase().includes('Cardsystem'.toLocaleLowerCase()) &&
    neugeraet.toLocaleLowerCase() !== 'vorhandene Karten sind i.O.'.toLocaleLowerCase()
  );
};

export const newDeviceAdditionalTextSelectionChanged = async (
  params: NewDeviceAdditionalTextSelectionChangedParams
) => {
  if (!params.data.DataContext) {
    return { error: null, validationError: null, result: null };
  }

  let addedProductId: number | null = null;
  let comboBoxDataItem: string | null = null;
  let removedProductId: number | null = null;

  if (params.addedItem) {
    comboBoxDataItem = params.addedItem;
    addedProductId = getProductId(
      params.data.DataContext.SamOfferProperty ?? 0,
      params.row.OldDeviceAnswer?.Text ?? '',
      params.addedItem,
      params.samOfferOldDeviceTexts,
      params.samOfferNewDeviceTexts
    );
  }

  if (params.removedItem) {
    removedProductId = getProductId(
      params.data.DataContext.SamOfferProperty ?? 0,
      params.row.OldDeviceAnswer?.Text ?? '',
      params.removedItem,
      params.samOfferOldDeviceTexts,
      params.samOfferNewDeviceTexts
    );
  }

  let updatedDetailProducts = params.detailProducts;
  let updatedGeraetDetails = params.geraete;
  let updatedTableData = params.tableData;

  const finalizeTableData = async () => {
    updatedTableData[params.rowIndex] = params.row;

    const targetRow = updatedTableData[params.rowIndex];

    if (targetRow.Article) {
      const { grossError, validationError, result } = await updateGrossExcl(
        updatedTableData,
        targetRow.Article,
        params.rowIndex,
        params.detailItems,
        updatedDetailProducts
      );
      if (grossError ?? validationError) {
        return { error: grossError, validationError, result: null };
      }
      if (result && !grossError) {
        updatedTableData = result;
      }
    }
    params.setTableData(updatedTableData);
    params.setDetailProducts(updatedDetailProducts);
    params.setGeraete(updatedGeraetDetails);
    return { error: null, validationError: null, result: null };
  };

  if (addedProductId !== null && removedProductId !== null && addedProductId === removedProductId) {
    return await finalizeTableData();
  }

  if (
    addedProductId !== null &&
    !updatedDetailProducts.find((it) => it.ProductId === addedProductId)
  ) {
    const newProduct: SamOfferProductDetail = {
      ProductId: addedProductId,
      Quantity: 1,
      SamOfferDetailId: params.data.DataContext.DetailId,
      SamOfferProductDetailId: getUniqueNumber(),
      SamOfferUId: '',
      SamOfferDetailUId: params.data.DataContext?.UId ?? '',
      UId: uuidv4(),
    };
    updatedDetailProducts.push(newProduct);
  }

  if (
    removedProductId !== null &&
    updatedDetailProducts.find((it) => it.ProductId === removedProductId)
  ) {
    updatedDetailProducts = updatedDetailProducts.filter((it) => it.ProductId !== removedProductId);
  }

  if (
    params.data.DataContext?.SamOfferProperty === 28 &&
    comboBoxDataItem !== null &&
    updatedGeraetDetails !== null
  ) {
    const manufacturerNumber =
      params.manufacturers.find(
        (it) =>
          it.NameWithoutNumberAtTheEnd?.toLocaleLowerCase() === comboBoxDataItem.toLocaleLowerCase()
      )?.Number ?? null;

    if (manufacturerNumber !== null) {
      const colorText = updatedGeraetDetails.ColorControlRow?.OldDeviceAnswer?.Text ?? null;
      let binding: string | null = null;

      if (updatedGeraetDetails.HasBinding) {
        binding = updatedGeraetDetails.BindingControlRow?.OldDeviceAnswer?.Text ?? null;
      }

      const getByGeraeteParams: GetByGeraeteParams = {
        mandantId: params.mandantId,
        productGroupNumbers: updatedGeraetDetails.ProductGroupNumbers,
        manufactureNumber: manufacturerNumber,
        hasArticleNumber: false,
        articleNumber: '',
        hasColor: false,
        color: colorText,
        hashBinding: updatedGeraetDetails.HasBinding,
        binding,
        manufacturers: params.manufacturers,
      };
      const byGeraete = await getByGeraete(getByGeraeteParams);

      if (byGeraete && byGeraete.length === 1) {
        const kvNoDetailItemNo2 = params.detailItems.find((it) => it.SamOfferProperty === 29);
        if (!kvNoDetailItemNo2) {
          return {
            error: 'idSamNoEigenschaft 29 konnte nicht gefunden werden!',
            validationError: null,
            result: null,
          };
        }

        const { updatedGeraetDetails: modifiedGeraetDetails, filteredDetailsProduct } = AddGeraet({
          samOfferDetailUId: kvNoDetailItemNo2.UId,
          samOfferDetailId: kvNoDetailItemNo2.DetailId,
          geraetItem: byGeraete[0],
          manufacturers: params.manufacturers,
          geraetDetails: updatedGeraetDetails,
          setGeraetDetails: params.setGeraete,
          detailProducts: updatedDetailProducts,
          setDetailProducts: params.setDetailProducts,
        });

        updatedGeraetDetails = modifiedGeraetDetails;
        updatedDetailProducts = filteredDetailsProduct;
      } else if (byGeraete && byGeraete.length > 1) {
        const values: string[] = [];
        byGeraete.forEach((it) => {
          values.push(String(it.Data.ArticleNumber));
        });
        if (updatedGeraetDetails?.ModelControlRow?.NewDeviceAdditional) {
          updatedGeraetDetails = {
            ...updatedGeraetDetails,
            ModelControlRow: {
              ...updatedGeraetDetails.ModelControlRow,
              NewDeviceAdditional: {
                ...updatedGeraetDetails.ModelControlRow.NewDeviceAdditional,
                DataSource: values,
                Type: 'ComboBox',
              },
            },
          };
        }
      } else {
        const values: string[] = [];
        if (updatedGeraetDetails?.ModelControlRow?.NewDeviceAdditional) {
          updatedGeraetDetails = {
            ...updatedGeraetDetails,
            ModelControlRow: {
              ...updatedGeraetDetails.ModelControlRow,
              NewDeviceAdditional: {
                ...updatedGeraetDetails.ModelControlRow.NewDeviceAdditional,
                DataSource: values,
                Type: 'ComboBox',
              },
            },
          };
        }
      }
    }
  }

  if (
    params.data.DataContext?.SamOfferProperty === 29 &&
    comboBoxDataItem !== null &&
    updatedGeraetDetails !== null
  ) {
    const manufacturerNumber2 =
      params.manufacturers.find(
        (it) =>
          it.NameWithoutNumberAtTheEnd?.toLocaleLowerCase() ===
          updatedGeraetDetails?.ManufactureControlRow?.NewDeviceAdditional?.Text?.toLocaleLowerCase()
      )?.Number ?? null;

    const getByGeraeteParams: GetByGeraeteParams = {
      mandantId: params.mandantId,
      productGroupNumbers: [],
      manufactureNumber: manufacturerNumber2,
      hasArticleNumber: true,
      articleNumber: comboBoxDataItem,
      hasColor: false,
      color: '',
      hashBinding: false,
      binding: '',
      manufacturers: params.manufacturers,
    };
    const byGeraet = await getByGeraete(getByGeraeteParams);
    const singleByGerate =
      byGeraet !== undefined
        ? byGeraet === null || byGeraet.length === 0
          ? null
          : byGeraet[0]
        : null;

    if (singleByGerate !== null) {
      const { updatedGeraetDetails: modifiedGeraetDetails, filteredDetailsProduct } = AddGeraet({
        samOfferDetailUId: params.data.DataContext.UId,
        samOfferDetailId: params.data.DataContext.DetailId,
        geraetItem: singleByGerate,
        manufacturers: params.manufacturers,
        geraetDetails: updatedGeraetDetails,
        setGeraetDetails: params.setGeraete,
        detailProducts: updatedDetailProducts,
        setDetailProducts: params.setDetailProducts,
      });
      updatedGeraetDetails = modifiedGeraetDetails;
      updatedDetailProducts = filteredDetailsProduct;
    }
  }

  if (
    params.data.DataContext?.SamOfferProperty === 68 &&
    comboBoxDataItem != null &&
    params.data.DataContext.OldDevice?.toLocaleLowerCase()?.includes(
      'Cardsystem'.toLocaleLowerCase()
    )
  ) {
    const isRequired2 = IsRequiredCardsystemOk(params.data, comboBoxDataItem);

    let reassigned88 = false;

    updatedTableData = updatedTableData.map((row: GridEditControl) => {
      const { ControlRow, OldDeviceAnswer } = row;

      if (
        ControlRow?.GridRow?.definition?.SamOfferPropertyId === 88 &&
        OldDeviceAnswer?.Text &&
        OldDeviceAnswer &&
        !reassigned88
      ) {
        reassigned88 = true;
        return {
          ...row,
          OldDeviceAnswer: {
            ...OldDeviceAnswer,
            isRequired: isRequired2,
          },
        };
      }

      return row;
    });
  }

  return await finalizeTableData();
};
