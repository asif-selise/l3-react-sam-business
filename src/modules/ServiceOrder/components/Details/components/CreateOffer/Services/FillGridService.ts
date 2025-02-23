import { type SamOfferProduct } from '@/src/hooks/useMasterData/masterData.interface';
import { type FillGridParams } from '../Interfaces/ParamsInterfaces/FillGridParams';
import { type LoadGridRowsParams } from '../Interfaces/ParamsInterfaces/LoadGridRowsParams';
import { type GridEditControl } from '../types';
import { getOldDeviceComboBoxData } from './GetOldComboBoxDataService';
import { type GetOldDeviceComboBoxDataParams } from '../Interfaces/ParamsInterfaces/GetOldDeviceComboBoxDataParams';
import { getNewDeviceComboBoxDataInfo } from './GetNewDeviceComboBoxDataInfoService';
import { type GetNewDeviceComboBoxDataInfoParams } from '../Interfaces/ParamsInterfaces/GetNewDeviceComboBoxDataInfoParams';
import { getInputModeFlags } from './GetInputModeFlagsService';
import { loadGridRows } from './LoadGridRowsService';
import { getDate } from '@/src/helpers/formatDate';

export const fillGrid = async (Params: FillGridParams) => {
  const loadGridRowsParams: LoadGridRowsParams = {
    IsNewSamOffer: Params.IsNewSamOffer,
    OrderId: Params.OrderId,
    SamOfferId: Params.SamOfferId,
    SamOfferType: Params.SamOfferType,
    ServiceOrderDetail: Params.ServiceOrderDetail,
    Manufacturers: Params.Manufacturers,
    SamOfferTypeProperties: Params.SamOfferTypeProperties,
    SamOfferProperties: Params.SamOfferProperties,
    DetailItems: Params.DetailItems,
    SetDetailItemsByCreation: Params.SetDetailItemsByCreation,
  };
  const { result: array, error: loadGridError } = loadGridRows(loadGridRowsParams);

  if (loadGridError) {
    return { data: [], error: loadGridError };
  }

  // let result: GridRowValues[];
  // let previousGridRows: KvNoDetailGridRowNo[];
  const mandantId = Params.OrderId % 10 !== 5 ? 1 : 2;
  const gridEditControls: GridEditControl[] = [];

  for (let i = 0; i < (array?.length ?? 0); i++) {
    const currentGridEditControl: GridEditControl = {
      RowDescription: null,
      OldDeviceAnswer: null,
      NewDeviceAdditional: null,
      Article: null,
      GrossExcl: null,
      ModifiedOn: null,
      ModifiedBy: null,
      ControlRow: null,
    };
    const productGroupNumbers = Params.GeraetDetails?.ProductGroupNumbers ?? [];
    // const samOfferPropertyId = array[i].definition.Id;
    const samOfferPropertyId = array[i].definition.SamOfferPropertyId;

    // #region [RowDescription]
    const rowDescriptionText =
      Params.SamOfferProperties.find(
        (it) => it.SamOfferPropertyId === array[i].definition.SamOfferPropertyId
      )?.Property?.toString() ?? '';
    currentGridEditControl.RowDescription = {
      Type: 'TextBox',
      Text: rowDescriptionText,
      DataContext: null,
      isReadOnly: true,
    };
    // #endregion

    // #region [OldDeviceAnswer]
    let isRequired = getInputModeFlags(array[i], 'Altgeraet', array, Params.SamOfferProperties);

    const getOldDeviceComboBoxDataParams: GetOldDeviceComboBoxDataParams = {
      MandantId: mandantId,
      ProductGroupNumbers: productGroupNumbers,
      SamOfferPropertyId: Number(samOfferPropertyId),
      Manufacturers: Params.Manufacturers,
      SamOfferOldDeviceTexts: Params.SamOfferOldDeviceTexts,
    };
    const oldDeviceComboBoxDataInfo = await getOldDeviceComboBoxData(
      getOldDeviceComboBoxDataParams
    );

    if (oldDeviceComboBoxDataInfo === null) {
      // ADD TEXT BOX
      currentGridEditControl.OldDeviceAnswer = {
        Type: 'TextBox',
        Text: array[i].detailItem.OldDevice, // Altgeraet
        DataSource: null,
        DataContext: array[i].detailItem,
        isReadOnly: false,
        isRequired,
      };
    } else {
      // ADD COMBO BOX
      currentGridEditControl.OldDeviceAnswer = {
        Type: 'ComboBox',
        Text: array[i].detailItem.OldDevice, // Altgeraet
        DataSource: oldDeviceComboBoxDataInfo,
        DataContext: array[i].detailItem,
        isEnabled: true,
        isRequired,
      };
      // TODO
      // editControl.Cbo.SourceUpdated += cboAlt_SourceUpdated;
    }
    // #endregion

    // #region [NewDevice_Additional]
    isRequired = getInputModeFlags(array[i], 'Neugeraet', array, Params.SamOfferProperties);
    const getNewDeviceComboBoxDataInfoParams: GetNewDeviceComboBoxDataInfoParams = {
      MandantId: mandantId,
      OldDeviceText: currentGridEditControl.OldDeviceAnswer.Text,
      ProductGroupNumbers: productGroupNumbers,
      SamOfferPropertyId: Number(samOfferPropertyId),
      Manufacturers: Params.Manufacturers,
      SamOfferOldDeviceTexts: Params.SamOfferOldDeviceTexts,
      SamOfferNewDeviceTexts: Params.SamOfferNewDeviceTexts,
    };
    const newDeviceAdditionalComboBoxDataInfo = await getNewDeviceComboBoxDataInfo(
      getNewDeviceComboBoxDataInfoParams
    );

    if (newDeviceAdditionalComboBoxDataInfo === null) {
      currentGridEditControl.NewDeviceAdditional = {
        Type: 'TextBox',
        Text: array[i].detailItem.NewDevice, // Neugeraet
        DataSource: null,
        DataContext: array[i].detailItem,
        isReadOnly: false,
        isRequired,
      };
      // newDeviceTextBox = true;
    } else {
      currentGridEditControl.NewDeviceAdditional = {
        Type: 'ComboBox',
        Text: array[i].detailItem.NewDevice, // Neugeraet
        DataSource: newDeviceAdditionalComboBoxDataInfo,
        DataContext: array[i].detailItem,
        isEnabled: !!(
          array[i].detailItem.NewDevice &&
          newDeviceAdditionalComboBoxDataInfo.includes(array[i].detailItem.NewDevice ?? '')
        ),
        isRequired,
      };
      // TODO
      // comboBox.SelectionChanged += cboNeu_SelectionChanged;
    }
    // #endregion

    // #region [Article]
    if (hasProducts(Number(samOfferPropertyId), Params.SamOfferProducts)) {
      currentGridEditControl.Article = {
        Type: 'Button',
        Text: 'Auswahl',
        isEnabled: currentGridEditControl.NewDeviceAdditional.Type === 'ComboBox',
        DataContext: array[i].detailItem,
        buttonEventType: 'Article',
      };
      // TODO
      // button.Click += btnArtikel_Click;
    } else if (array[i].definition.SamOfferPropertyId === 29) {
      currentGridEditControl.Article = {
        Type: 'Button',
        Text: 'Auswahl',
        isEnabled: true,
        DataContext: array[i].detailItem,
        buttonEventType: 'Geraet',
      };
      // TODO
      // button.Click += btnArtikel_Click;
    } else {
      currentGridEditControl.Article = {
        Type: 'TextBox',
        Text: '---',
        DataContext: array[i].detailItem,
        buttonEventType: 'None',
      };
    }
    // #endregion

    // #region [GrossExcl]
    isRequired = getInputModeFlags(array[i], 'Preis', array, Params.SamOfferProperties);
    currentGridEditControl.GrossExcl = {
      Type: 'TextBox',
      Text: array[i].detailItem.GrossExcl?.toString() ?? null, // BruttoExkl
      isReadOnly: false,
      DataContext: array[i].detailItem,
      isRequired,
    };
    // TODO
    // textBox.SourceUpdated += BruttoExkl_Updated;
    // textBox.TargetUpdated += BruttoExkl_Updated;
    // #endregion

    // #region [ModifiedOn]
    currentGridEditControl.ModifiedOn = {
      Type: 'TextBox',
      Text: array[i].detailItem.ModifiedOnDetail?.toString() ?? getDate(String(new Date())),
      isReadOnly: true,
      DataContext: array[i].detailItem,
    };
    // #endregion

    // #region [ModifiedBy]
    currentGridEditControl.ModifiedBy = {
      Type: 'TextBox',
      Text: array[i].detailItem?.ModifiedByDetail ?? Params.SystemUser,
      isReadOnly: true,
      DataContext: array[i].detailItem,
    };
    // #endregion

    // SetControlsRow
    if (Params.GeraetDetails) {
      switch (array[i].definition.SamOfferPropertyId) {
        case Params.GeraetDetails.Manufacture:
          Params.SetGeraetDetails({
            ...Params.GeraetDetails,
            ManufactureControlRow: currentGridEditControl,
          });

          break;

        case Params.GeraetDetails.Model:
          Params.SetGeraetDetails({
            ...Params.GeraetDetails,
            ModelControlRow: currentGridEditControl,
          });
          break;

        case Params.GeraetDetails.Color:
          Params.SetGeraetDetails({
            ...Params.GeraetDetails,
            ColorControlRow: currentGridEditControl,
          });
          break;

        case Params.GeraetDetails.Binding:
          Params.SetGeraetDetails({
            ...Params.GeraetDetails,
            BindingControlRow: currentGridEditControl,
          });
          break;
      }
    }

    // Add control
    currentGridEditControl.ControlRow = {
      GridRow: array[i],
      Old: currentGridEditControl.OldDeviceAnswer,
      New: currentGridEditControl.NewDeviceAdditional,
      Gross: currentGridEditControl.GrossExcl.Text,
    };

    gridEditControls.push(currentGridEditControl);
  }

  return { data: gridEditControls, error: '' };
};

const hasProducts = (samOfferPropertyId: number, samOfferProducts: SamOfferProduct[]) => {
  const products = samOfferProducts.filter(
    (iterator) => iterator.SamOfferPropertyId === samOfferPropertyId
  );

  return products?.length > 0;
};
