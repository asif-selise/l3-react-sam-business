import { renderHook, waitFor } from '@testing-library/react';
import { getData } from '@/indexedDb';
import useIndexedDbData from './useIndexedDbData.hook';

jest.mock('@/indexedDb');
const mockedGetData = getData as jest.Mock;

describe('useIndexedDbData hook', () => {
  beforeEach(() => {
    mockedGetData.mockReset();
  });

  test('fetches data list successfully', async () => {
    const mockDataList = [
      { id: 1, name: 'Test 1', value: 10 },
      { id: 2, name: 'Test 2', value: 20 },
    ];
    mockedGetData.mockResolvedValueOnce(mockDataList);

    const { result } = renderHook(() => useIndexedDbData('TestEntity', 'TestKey'));

    expect(result.current.dataList).toEqual([]);
    expect(result.current.isLoading).toBe(false);

    result.current.getDataList();

    await waitFor(() => {
      expect(mockedGetData).toHaveBeenCalledWith('TestEntity', 'TestKey');
      expect(result.current.dataList).toEqual(mockDataList);
      expect(result.current.isLoading).toBe(false);
    });
  });

  // test('fetches data item successfully', async () => {
  //   const mockDataList = [
  //     { id: 1, name: 'Test 1', value: 10 },
  //     { id: 2, name: 'Test 2', value: 20 },
  //   ];
  //   const mockDataItem = { id: 2, name: 'Test 2', value: 20 };
  //   mockedGetData.mockResolvedValueOnce(mockDataList);

  //   const { result } = renderHook(() => useIndexedDbData('TestEntity', 'TestKey'));

  //   expect(result.current.dataItem).toEqual({});
  //   expect(result.current.isLoading).toBe(false);

  //   result.current.getDataItem('id', 2);

  //   await waitFor(() => {
  //     expect(mockedGetData).toHaveBeenCalledWith('TestEntity', 'TestKey');
  //     expect(result.current.dataItem).toEqual(mockDataItem);
  //     expect(result.current.isLoading).toBe(false);
  //   });
  // });

  test('handles empty data response', async () => {
    mockedGetData.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useIndexedDbData('TestEntity', 'TestKey'));

    result.current.getDataList();

    await waitFor(() => {
      expect(mockedGetData).toHaveBeenCalledWith('TestEntity', 'TestKey');
      expect(result.current.dataList).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('handles null data response', async () => {
    mockedGetData.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useIndexedDbData('TestEntity', 'TestKey'));

    result.current.getDataList();

    await waitFor(() => {
      expect(mockedGetData).toHaveBeenCalledWith('TestEntity', 'TestKey');
      expect(result.current.dataList).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  // test('fetches filtered data list successfully', async () => {
  //   const mockDataList = [
  //     { id: 1, name: 'Test 1', value: 10 },
  //     { id: 2, name: 'Test 2', value: 20 },
  //   ];
  //   const mockFilteredDataList = [{ id: 2, name: 'Test 2', value: 20 }];
  //   mockedGetData.mockResolvedValueOnce(mockDataList);

  //   const { result } = renderHook(() => useIndexedDbData('TestEntity', 'TestKey', 'value'));

  //   expect(result.current.filteredDataList).toEqual([]);
  //   expect(result.current.isLoading).toBe(false);

  //   result.current.getFilteredDataList(20);

  //   await waitFor(() => {
  //     expect(mockedGetData).toHaveBeenCalledWith('TestEntity', 'TestKey');
  //     expect(result.current.filteredDataList).toEqual(mockFilteredDataList);
  //     expect(result.current.isLoading).toBe(false);
  //   });
  // });
});
