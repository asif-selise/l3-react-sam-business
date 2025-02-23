export const buildComboBoxDataInfo = (values: string[], addEmptyRow = true) => {
  const comboBoxDataInfo: string[] = [];

  if (addEmptyRow) {
    comboBoxDataInfo.push('');
  }

  comboBoxDataInfo.concat(values);

  return comboBoxDataInfo;
};
