import type { EditControl } from '../types';
import { getNewDeviceComboBoxDataInfo } from './GetNewDeviceComboBoxDataInfoService';
import { type GetNewDeviceComboBoxDataInfoParams } from '../Interfaces/ParamsInterfaces/GetNewDeviceComboBoxDataInfoParams';
import { type initCboParams } from '../Interfaces/ParamsInterfaces/InitCboParams';

const IsRequiredKeinKassiersystem = (data: EditControl) => {
  return (
    data.DataContext?.SamOfferProperty === 68 &&
    data.Text?.toLocaleLowerCase() === 'keines vorhanden'
  );
};

export const initCbo = async (params: initCboParams) => {
  // console.log('Response params.samOfferOldDeviceTexts', params.samOfferOldDeviceTexts);
  // console.log('Response params.data.DataContext', params.data.DataContext);
  // console.log('Response params.row.OldDeviceAnswer?.DataContext?.SamOfferProperty', params.row.OldDeviceAnswer?.DataContext?.SamOfferProperty);
  const samOfferOldDeviceText = params.samOfferOldDeviceTexts.find(
    (it) => it.SamOfferPropertyId === params.data.DataContext?.SamOfferProperty
  );
  // console.log('Response samOfferOldDeviceText', samOfferOldDeviceText);
  const isMandatory = samOfferOldDeviceText?.IsNewDeviceMandatory ?? false;
  // console.log('Response isMandatory', isMandatory);

  // TODO: do code for special cases
  const tableDataRef = { ...params.tableData };
  if (params.data.DataContext?.SamOfferProperty === 68) {
    const isRequired2 = IsRequiredKeinKassiersystem(params.data);
    let reassigned69 = false;
    let reassigned87 = false;

    for (const row of tableDataRef) {
      const { ControlRow, OldDeviceAnswer } = row;

      if (
        ControlRow?.GridRow?.definition?.SamOfferPropertyId === 69 &&
        OldDeviceAnswer &&
        !reassigned69
      ) {
        OldDeviceAnswer.isRequired = isRequired2;
        reassigned69 = true;
      }

      if (
        ControlRow?.GridRow?.definition?.SamOfferPropertyId === 87 &&
        OldDeviceAnswer?.Text &&
        OldDeviceAnswer &&
        !reassigned87
      ) {
        OldDeviceAnswer.isRequired = isRequired2;
        reassigned87 = true;
      }
    }
  }

  const getNewDeviceComboBoxDataInfoParams: GetNewDeviceComboBoxDataInfoParams = {
    MandantId: params.mandantId,
    OldDeviceText: params.oldDeviceUpdatedText,
    ProductGroupNumbers: params.productGroupNumbers,
    SamOfferPropertyId: params.row.OldDeviceAnswer?.DataContext?.SamOfferProperty ?? 0,
    Manufacturers: params.manufacturers,
    SamOfferOldDeviceTexts: params.samOfferOldDeviceTexts,
    SamOfferNewDeviceTexts: params.samOfferNewDeviceTexts,
  };
  const comboBoxDataInfo = await getNewDeviceComboBoxDataInfo(getNewDeviceComboBoxDataInfoParams);

  if (comboBoxDataInfo !== null) {
    const result: EditControl = {
      Type: 'ComboBox',
      Text: params.row.NewDeviceAdditional?.Text ?? null,
      DataSource: comboBoxDataInfo,
      DataContext: params.row.NewDeviceAdditional?.DataContext ?? null,
      isRequired: isMandatory,
    };
    // console.log('Response result', result);
    // row.NewDevice_Additional = result;
    return result;
  }

  const result: EditControl = {
    Type: 'TextBox',
    Text: params.row.NewDeviceAdditional?.Text ?? null,
    DataSource: null,
    DataContext: params.row.NewDeviceAdditional?.DataContext ?? null,
    isRequired: isMandatory,
  };

  return result;
};
