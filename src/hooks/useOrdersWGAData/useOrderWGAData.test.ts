import useOrderWGAData from './useOrderWGAData';
import { getData } from '@/indexedDb';
import { act, renderHook } from '@testing-library/react';
import { set } from 'idb-keyval';

jest.mock('@/indexedDb', () => ({
  getData: jest.fn(),
  getAllData: jest.fn(),
}));
jest.mock('idb-keyval', () => ({
  set: jest.fn(),
}));
jest.mock('@/src/helpers/formatDate', () => ({
  formatDate: jest.fn(() => '2024-11-10'),
}));

describe('useOrderWGAData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize data when currentData is null or outdated', async () => {
    (getData as jest.Mock).mockResolvedValueOnce(null);
    const { result } = renderHook(() => useOrderWGAData());

    await act(async () => {
      await result.current.initializeData();
    });

    expect(getData).toHaveBeenCalledWith('OrdersWGAData');
    expect(set).toHaveBeenCalledWith(
      'OrdersWGAData',
      JSON.stringify({
        date: '2024-11-10',
        data: [],
      })
    );
    expect(result.current.isLoading).toBe(false);
  });

  test('should update IsSynchronizing status for each item in data', async () => {
    const mockData = {
      date: '2024-11-09',
      data: [
        {
          Id: 1,
          Product: 1001,
          Quantity: 5,
          ArticleNumber: 'A1',
          ProductText: 'Product A',
          IsSynchronizing: false,
        },
        {
          Id: 2,
          Product: 1002,
          Quantity: 3,
          ArticleNumber: 'B2',
          ProductText: 'Product B',
          IsSynchronizing: false,
        },
      ],
    };

    (getData as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOrderWGAData());

    await act(async () => {
      await result.current.updateIsSynchronizingStatus();
    });

    const expectedData = {
      ...mockData,
      data: mockData.data.map((item) => ({ ...item, IsSynchronizing: true })),
    };

    expect(getData).toHaveBeenCalledWith('OrdersWGAData');
    expect(set).toHaveBeenCalledWith('OrdersWGAData', JSON.stringify(expectedData));
    expect(result.current.isLoading).toBe(false);
  });

  test('should not reinitialize data if currentData date is today', async () => {
    const mockData = {
      date: '2024-11-10',
      data: [],
    };

    (getData as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOrderWGAData());

    await act(async () => {
      await result.current.initializeData();
    });

    expect(getData).toHaveBeenCalledWith('OrdersWGAData');
    expect(set).not.toHaveBeenCalled();
  });
});
