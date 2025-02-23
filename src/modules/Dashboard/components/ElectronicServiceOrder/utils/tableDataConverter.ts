import { type TableData } from '@/src/components/CustomTable/types';

export function convertToTableData<T extends object>(obj: T): TableData {
  const tableData: TableData = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        tableData[key] = value;
      } else if (value === null) {
        tableData[key] = '';
      } else {
        tableData[key] = JSON.stringify(value);
      }
    }
  }

  return tableData;
}

export function convertArrayToTableData<T extends object>(arr: T[]): TableData[] {
  return arr.map((item) => convertToTableData(item));
}
