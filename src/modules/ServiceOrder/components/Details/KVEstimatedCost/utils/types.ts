import { type SamKvAutoCalculationFactor } from '@/src/hooks/useMasterData/masterData.interface';
import { type SamKv } from '@/src/hooks/useTourData/tourData.interface';

export interface Factor {
  version: number;
  tabFactor: SamKvAutoCalculationFactor;
}

export interface KvCostFields extends SamKv {
  TotalMaterialsOperation: number;
  TotalMaterialsLifeTime: number;
  IncludeMaterialOperation: number;
  IncludeMaterialLifeTime: number;
}
