import { type SamOffer } from '@/src/hooks/useTourData/tourData.interface';

export interface KvNoHeaderNo extends Partial<SamOffer> {
  TotalArticle?: number; // ArtikelTotal
  TotalExkl?: number; // TotalExkl
  TotalInkl?: number; // TotalInkl
  NeedsLevelSkillsText?: string; // BrauchtNivSkillsText
}
