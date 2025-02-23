import { v4 as uuidv4 } from 'uuid';

const populateUniqueID = (data: any) => {
  const newData = { ...data };

  for (const key in newData) {
    if (!['WoodOrders', 'WoodOrderDetails'].includes(key) && Array.isArray(newData[key])) {
      newData[key] = newData[key].map((item: any) => ({
        ...item,
        UId: uuidv4(),
      }));
    }
  }

  return newData;
};

export default populateUniqueID;
