import { useState } from 'react';
import { getData, updateData } from '@/indexedDb';
import { type updateDataStructure } from '../useUpdateAPI/updateDataModel';
import { type IActionType } from './type';

interface ReturnType<T> {
  dataList: T[];
  getDataList: () => Promise<T[] | null>;
  isLoading: boolean;
  dataItem: T | null;
  getDataItem: <K extends keyof T>(key: K, value: T[K]) => Promise<void>;
  filteredDataList: T[];
  getFilteredDataList: <K extends keyof T>(filteredKey: K, filteredValue: T[K]) => Promise<void>;
  updateDataList: (
    updatedDataList: T[],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
  updateDataLists: <K extends keyof T>(
    updatedFilteredDataList: T[],
    filteredKey: K,
    filteredValue: T[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => Promise<void>;
  customFilteredDataList: T[];
  getCustomFilteredDataList: (condition: (item: T) => boolean) => Promise<T[]>;
  getDataItemAsync: any;
}

const useIndexedDbData = <T>(entity: string, key: string): ReturnType<T> => {
  const [dataItem, setDataItem] = useState<T | null>(null);
  const [dataList, setDataList] = useState<T[]>([]);
  const [filteredDataList, setFilteredDataList] = useState<T[]>([]);
  const [customFilteredDataList, setCustomFilteredDataList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllData = async (): Promise<T[] | null> => {
    return await getData(entity, key);
  };

  const getDataList = async () => {
    setIsLoading(true);
    const data = await getAllData();
    if (data) {
      setDataList(data);
    }
    setIsLoading(false);
    return data;
  };

  const getDataItem = async <K extends keyof T>(key: K, value: T[K]) => {
    setIsLoading(true);
    const allData = await getAllData();
    if (allData) {
      const desiredData = allData.find((data: T) => data[key] === value);
      if (desiredData) {
        setDataItem(desiredData);
      }
    }
    setIsLoading(false);
  };

  const getDataItemAsync = async <K extends keyof T>(key: K, value: T[K]) => {
    const allData = await getAllData();
    if (allData) {
      const desiredData = allData.find((data: T) => data[key] === value);
      if (desiredData) {
        return desiredData;
      }
    }
    return null;
  };

  const getFilteredDataList = async <K extends keyof T>(filteredKey: K, filteredValue: T[K]) => {
    setIsLoading(true);
    const data = await getAllData();
    if (data) {
      const filteredData = data.filter((data: T) => data[filteredKey] === filteredValue);
      setFilteredDataList(filteredData);
    }
    setIsLoading(false);
  };

  const updateDataList = async (
    updatedDataList: T[],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ) => {
    setIsLoading(true);

    await updateData(entity, key, updatedDataList, updatedData, actionModel, actionType);

    setDataList(updatedDataList);
    setIsLoading(false);
  };

  const updateDataLists = async <K extends keyof T>(
    updatedFilteredDataList: T[],
    filteredKey: K,
    filteredValue: T[K],
    updatedData: any,
    actionType: IActionType,
    actionModel: keyof typeof updateDataStructure
  ): Promise<void> => {
    setIsLoading(true);
    const data = await getAllData();

    if (data) {
      const dataWithoutFiltered = data.filter((data: T) => data[filteredKey] !== filteredValue);
      const updatedDataList = [...dataWithoutFiltered, ...updatedFilteredDataList];

      await updateData(entity, key, updatedDataList, updatedData, actionModel, actionType);

      setDataList(updatedDataList);
      setFilteredDataList(updatedFilteredDataList);
      setIsLoading(false);
    }
  };

  const getCustomFilteredDataList = async (condition: (item: T) => boolean) => {
    setIsLoading(true);
    const data = await getAllData();
    let filteredData: T[] = [];

    if (data) {
      filteredData = data.filter(condition);
      setCustomFilteredDataList(filteredData);
    }
    setIsLoading(false);
    return filteredData;
  };

  return {
    dataList,
    getDataList,
    isLoading,
    dataItem,
    getDataItem,
    filteredDataList,
    getFilteredDataList,
    updateDataList,
    updateDataLists,
    customFilteredDataList,
    getCustomFilteredDataList,
    getDataItemAsync,
  };
};

export default useIndexedDbData;
