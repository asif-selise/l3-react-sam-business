import { type KvNoHeaderNo } from '../Interfaces/KvNoHeaderNo';

export const calculateTotalExkl = (kvNoHeaderNo: KvNoHeaderNo) => {
  let num: number | null = null;

  if (kvNoHeaderNo.TotalArticle !== undefined) {
    if (num === null) {
      num = 0;
    }
    num += kvNoHeaderNo.TotalArticle;
  }

  if (kvNoHeaderNo.Vrg !== undefined) {
    if (num === null) {
      num = 0;
    }
    num += kvNoHeaderNo.Vrg ?? 0;
  }

  if (kvNoHeaderNo.Takeover !== undefined) {
    if (num === null) {
      num = 0;
    }
    num += kvNoHeaderNo.Takeover ?? 0;
  }

  if (kvNoHeaderNo.Installation !== undefined) {
    if (num === null) {
      num = 0;
    }
    num += kvNoHeaderNo.Installation ?? 0;
  }

  if (kvNoHeaderNo.Accessory !== undefined) {
    if (num === null) {
      num = 0;
    }
    num += kvNoHeaderNo.Accessory ?? 0;
  }

  return num;
};
