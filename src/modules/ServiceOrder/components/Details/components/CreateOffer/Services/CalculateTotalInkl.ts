import { type KvNoHeaderNo } from '../Interfaces/KvNoHeaderNo';

export const calculateTotalInkl = (kvNoHeaderNo: KvNoHeaderNo) => {
  if (kvNoHeaderNo.TotalExkl !== undefined && kvNoHeaderNo.VatRate !== undefined) {
    return kvNoHeaderNo.TotalExkl * (1 + kvNoHeaderNo.VatRate);
  }
  return null;
};
