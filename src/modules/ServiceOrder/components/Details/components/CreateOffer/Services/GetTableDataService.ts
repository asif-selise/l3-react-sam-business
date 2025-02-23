import { type GetTableDataParams } from '../Interfaces/ParamsInterfaces/GetTableDataParams';
import { fillGrid } from './FillGridService';

export const getTableData = async (Params: GetTableDataParams) => {
  return await fillGrid(Params);
};
