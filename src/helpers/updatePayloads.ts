import type { UpdateAPIData } from '@/src/hooks/useUpdateAPI/interface';
import { getData, setData } from '@/indexedDb';

export const updatePayloadsIndexDb = async (data: any) => {
  let queuedPayloads: UpdateAPIData[] = (await getData('queuedPayloads')) ?? [];
  const failedPayloads: UpdateAPIData[] = (await getData('failedPayloads')) ?? [];

  data.ProcessedIds.forEach((id: string) => {
    queuedPayloads = queuedPayloads.filter((item) => item.Id !== id);
  });

  data.UnProcessedIds.forEach((id: string) => {
    queuedPayloads = queuedPayloads.filter((item) => item.Id !== id);
  });

  data.FailedIds.forEach((id: string) => {
    const failedPayload = queuedPayloads.find((item) => item.Id === id);
    if (failedPayload !== undefined && failedPayload != null) {
      failedPayloads.push(failedPayload);
    }
    queuedPayloads = queuedPayloads.filter((item) => item.Id !== id);
  });

  await setData('queuedPayloads', queuedPayloads);
  await setData('failedPayloads', failedPayloads);
};
