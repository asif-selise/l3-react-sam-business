import { type KvNoDetailGridRowNo } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/KvNoDetailGridRowNo';
import { type EditControl } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/types';

export interface ControlsRow {
  GridRow: KvNoDetailGridRowNo;
  Old: EditControl; // Alt
  New: EditControl; // New
  Gross: string | null; // Brutto
}
