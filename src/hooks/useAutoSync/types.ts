export interface AutoSyncReturnType {
  syncData: () => Promise<void>;
  isBlockedServiceOrder: (serviceOrderId: string) => boolean;
  syncNeeded: () => Promise<boolean>;
}

export interface UpdateDataResultDto {
  ProcessedIds: string[];
  FailedIds: string[];
  UnProcessedIds: string[];
  ErrorMessages: string[];
}
