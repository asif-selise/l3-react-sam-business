import type { Manufacturer } from '@/src/hooks/useMasterData/masterData.interface';

export interface GetByGeraeteParams {
  mandantId: number;
  productGroupNumbers: number[];
  manufactureNumber: number | null;
  hasArticleNumber: boolean;
  articleNumber: string;
  hasColor: boolean;
  color: string | null;
  hashBinding: boolean;
  binding: string | null;
  manufacturers: Manufacturer[];
}
