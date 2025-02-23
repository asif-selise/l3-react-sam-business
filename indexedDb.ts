/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { get, set } from 'idb-keyval';
import { type IActionType } from './src/hooks/useIndexedDbData/type';

export async function storeData(key: string, value: string) {
  await set(key, value);
}

export async function getData(key: string, property: string = '') {
  const data = await get(key);
  if (!data) {
    return null;
  }
  const parsedData = JSON.parse(data);
  return property !== '' ? parsedData[property] : parsedData;
}

export async function updateData(
  key: string,
  property: string,
  updatedDataList: any,
  updatedData: any,
  actionModel: string,
  actionType: IActionType
) {
  const allData = await getData(key);
  const newData = { ...allData, [property]: updatedDataList };

  if (key === 'TourPlanData') {
    await updateUpdateDataModel(updatedData, actionType, actionModel);
  }
  await set(key, JSON.stringify(newData));
}

export const updateUpdateDataModel = async (
  updatedData: any,
  actionType: IActionType,
  actionModel: string
) => {
  const updateApiPayload = await getData('UpdatedData');
  const updatedDataArray = Array.isArray(updatedData) ? updatedData : [updatedData];

  updatedDataArray.forEach((updatedDataItem) => {
    switch (actionType) {
      case 'InsertRecords':
        insertToUpdateApiPayload(updateApiPayload[actionModel], updatedDataItem);
        break;
      case 'UpdateRecords':
        updateToUpdateApiPayload(updateApiPayload[actionModel], updatedDataItem);
        break;
      case 'DeleteRecords':
        deleteToUpdateApiPayload(updateApiPayload[actionModel], updatedDataItem);
        break;
    }
  });

  await set('UpdatedData', JSON.stringify(updateApiPayload));
};

const insertToUpdateApiPayload = (payload: any, newData: any) => {
  payload.InsertRecords.push(newData);
};

const updateToUpdateApiPayload = (payload: any, newData: any) => {
  const insertRecordsIndex = payload.InsertRecords.findIndex((obj: any) => obj.UId === newData.UId);
  if (insertRecordsIndex > -1) {
    payload.InsertRecords[insertRecordsIndex] = newData;
    return;
  }
  const updateRecordsIndex = payload.UpdateRecords.findIndex((obj: any) => obj.UId === newData.UId);
  if (updateRecordsIndex > -1) {
    payload.UpdateRecords[updateRecordsIndex] = newData;
    return;
  }
  payload.UpdateRecords.push(newData);
};

const deleteToUpdateApiPayload = (payload: any, data: any) => {
  const insertRecordsIndex = payload.InsertRecords.findIndex((obj: any) => obj.UId === data.UId);
  if (insertRecordsIndex > -1) {
    payload.InsertRecords.splice(insertRecordsIndex, 1);
    return;
  }
  const updateRecordsIndex = payload.UpdateRecords.findIndex((obj: any) => obj.UId === data.UId);
  if (updateRecordsIndex > -1) {
    payload.UpdateRecords.splice(updateRecordsIndex, 1);
  }
  payload.DeleteRecords.push(data);
};

export async function setData(key: string, data: any) {
  await set(key, JSON.stringify(data));
}
