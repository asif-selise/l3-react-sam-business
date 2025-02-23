export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: string;
  label: string;
  sortable: boolean;
  align?: 'right' | 'center' | 'left';
}

export type TableData = Record<string, string | number | boolean>;
