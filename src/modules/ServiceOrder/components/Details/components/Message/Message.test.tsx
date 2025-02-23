import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Message from './Message';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import configureMockStore from 'redux-mock-store';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => jest.fn());

describe('Message component', () => {
  let mockGetMessageData: jest.Mock;
  let mockUpdateSODataList: jest.Mock;

  beforeEach(() => {
    mockGetMessageData = jest.fn();
    mockUpdateSODataList = jest.fn();

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataItem: {
        OrderId: 1,
        FaultReportOrderSupplement: 'Test Report Message',
        FaultReportOrder: 'Test Invoice Message',
        IsEB_SO: true,
      },
      getDataItem: mockGetMessageData,
      dataList: [],
      getDataList: jest.fn(),
      updateDataLists: mockUpdateSODataList,
    });
  });

  const store = configureMockStore()({
    snackbar: {
      snackbarQueue: [
        {
          key: 'snackbar_id_1',
          isVisible: true,
          type: 'success',
          title: 'Success snackbar',
        },
        {
          key: 'snackbar_id_2',
          isVisible: true,
          type: 'error',
          title: 'Error snackbar',
        },
      ],
    },
    serviceOrder: {
      id: 56,
    },
    soStatus: {
      soStatus: 'ReadOnly',
    },
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      sOData: {
        OrderId: 1,
        FaultReportOrderSupplement: 'Test Report Message',
        FaultReportOrder: 'Test Invoice Message',
        IsEB_SO: true,
      } as any,
      getSOData: jest.fn().mockResolvedValue({}),
      sODataList: [],
      getSODataList: jest.fn().mockResolvedValue([]),
      updateSODataList: jest.fn(),
    };

    return renderRootProvider(<Message {...defaultProps} {...props} />, { store });
  };

  test('renders correctly', () => {
    renderComponent();

    expect(screen.getAllByText('REPORT')).toHaveLength(2);
    expect(screen.getByText('REPORT_MESSAGE')).toBeInTheDocument();
    expect(screen.getByText('INVOICE_MESSAGE')).toBeInTheDocument();
    expect(screen.getByText('Test Report Message')).toBeInTheDocument();
    expect(screen.getByText('Test Invoice Message')).toBeInTheDocument();
  });

  test('opens the edit message modal when the edit button is clicked', () => {
    renderComponent();

    const editButton = screen.getByText('EDIT_MESSAGE');
    fireEvent.click(editButton);

    waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('saves changes and updates data correctly', async () => {
    renderComponent();

    const editButton = screen.getByText('EDIT_MESSAGE');
    fireEvent.click(editButton);

    waitFor(async () => {
      const saveButton = screen.getByText('SAVE');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateSODataList).toHaveBeenCalled();
      });
    });
  });

  test('closes the modal when the discard button is clicked', () => {
    renderComponent();

    const editButton = screen.getByText('EDIT_MESSAGE');
    fireEvent.click(editButton);

    waitFor(() => {
      const discardButton = screen.getByText('DISCARD');
      fireEvent.click(discardButton);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
