import { type Dayjs } from 'dayjs';

export interface InventoryQueryFields {
  FromDate: Dayjs | null;
  ToDate: Dayjs | null;
}
