import { renderHook, act, waitFor } from '@testing-library/react';
import useReadOnly from './useReadOnly.hook';
import { queryClientConfig } from '@/src/components/TanstackProvider/TanstackProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import { useParams } from 'react-router-dom';
import useIndexedDbData from '../useIndexedDbData/useIndexedDbData.hook';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../useIndexedDbData/useIndexedDbData.hook');

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((selector) => selector({ serviceOrder: { id: 1 } })),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClientConfig()}>{children}</QueryClientProvider>
);

describe('useReadOnly', () => {
  const mockGetDataItem = jest.fn();
  const mockGetDataList = jest.fn();

  beforeEach(() => {
    (useIndexedDbData as jest.Mock).mockImplementation((dbName) => {
      if (dbName === 'TourPlanData') {
        return {
          dataItem: null,
          getDataItem: mockGetDataItem,
        };
      }
      if (dbName === 'MasterData') {
        return {
          dataList: [],
          getDataList: mockGetDataList,
        };
      }
      return {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderReadOnlyHook = () => renderHook(() => useReadOnly(), { wrapper });

  it('should call getCurrentUserRightToFrontendAlls on mount', () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    renderReadOnlyHook();

    expect(mockGetDataList).toHaveBeenCalledTimes(1);
  });

  it('should call getWorkflowDetail when id is provided', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    renderReadOnlyHook();

    expect(mockGetDataItem).toHaveBeenCalledWith('OrderId', 1);
    expect(mockGetDataItem).toHaveBeenCalledTimes(2);
  });

  it('should set readOnly to true when there is no userActiveStatus and workFlowStatus is false', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const mockWorkflowDetailData = { DoneOn: null, Processor: 'someprocessor' };
    (useIndexedDbData as jest.Mock).mockImplementation((dbName) => {
      if (dbName === 'TourPlanData') {
        return {
          dataItem: mockWorkflowDetailData,
          getDataItem: mockGetDataItem,
        };
      }
      if (dbName === 'MasterData') {
        return {
          dataList: [{ RightToFrontendUser: '178' }],
          getDataList: mockGetDataList,
        };
      }
      return {};
    });

    const { result } = renderReadOnlyHook();

    act(() => {
      result.current.setReadOnly(result.current.readOnly);
    });

    waitFor(() => {
      expect(result.current.readOnly).toBe(true);
    });
  });
});
