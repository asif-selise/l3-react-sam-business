import { type IDetail } from '../Interfaces/IDetail';
import { type EditControl, type GridEditControl } from '../types';
import { isRowIndexValid } from './isRowIndexValid';
import { RecalcGross } from './RecalcGross';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';

export const updateGrossExcl = async (
  listData: GridEditControl[],
  rowData: EditControl,
  rowIndex: number,
  detailItemsByCreation: [] | IDetail[],
  detailProducts: SamOfferProductDetail[] | null
) => {
  const indexValidation = isRowIndexValid(rowIndex, listData);
  if (indexValidation) {
    return { validationError: indexValidation, grossError: null, result: null };
  }

  const { value: grossValue, error: grossError } = await RecalcGross(
    rowData,
    detailItemsByCreation ?? [],
    detailProducts ?? []
  );

  if (grossError) {
    return { grossError, validationError: null, result: null };
  }

  const updatedListData = [...listData];
  const targetRow = updatedListData[rowIndex];

  if (targetRow.GrossExcl) {
    targetRow.GrossExcl.Text = String(grossValue ?? '');
    return { grossError: null, validationError: null, result: updatedListData };
  }
  return { grossError: null, validationError: null, result: null };
};
