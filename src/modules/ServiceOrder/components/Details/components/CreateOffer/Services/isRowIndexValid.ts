import { type GridEditControl } from '../types';

export const isRowIndexValid = (rowIndex: number | null, data: GridEditControl[]) => {
  if (!rowIndex || rowIndex < 0 || rowIndex >= data.length) {
    return 'INVALID_ROW_SELECTED';
  }

  return '';
};
