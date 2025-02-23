import { type Order } from './types';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(
  order: Order,
  orderBy: string
): (
  a: Record<string, string | number | boolean>,
  b: Record<string, string | number | boolean>
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const getCustomTableSettings = (
  tableName: string
): { columnVisibility: Record<string, boolean>; rowsPerPage: number } | null => {
  const saved = localStorage.getItem('TableSettings');
  if (saved) {
    const parsedData = JSON.parse(saved);
    return parsedData[tableName] ?? null;
  }
  return null;
};

export const updateCustomTableSettings = (
  tableName: string,
  updatedData: { columnVisibility: Record<string, boolean>; rowsPerPage: number }
) => {
  const saved = localStorage.getItem('TableSettings');
  const currentData = saved ? JSON.parse(saved) : {};
  const newData = { ...currentData, [tableName]: updatedData };

  localStorage.setItem('TableSettings', JSON.stringify(newData));
};
