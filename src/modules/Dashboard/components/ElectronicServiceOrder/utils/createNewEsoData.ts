import dayjs from 'dayjs';
import { type WorkflowDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type CreateESOFields } from '@/src/modules/Dashboard/components/ElectronicServiceOrder/types';

const createNewEsoData = (
  formData: CreateESOFields,
  systemUser: string
): Partial<WorkflowDetail> => {
  if (!formData.NewESO) return {};

  return {
    OrderId: Number(formData.SO),
    WorkflowItemId: formData.NewESO.Id,
    ItemType: formData.NewESO.TypeItem,
    WorkflowRemark: formData.Remarks,
    Creator: systemUser,
    CreatedAt: dayjs().toISOString(),
  };
};

export default createNewEsoData;
