/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { useParams } from 'react-router-dom';
import ExpenseCalculator from './ExpenseCalculator';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    filteredDataList: [],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  })
);

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
  serviceOrder: { id: 56 },
  soStatus: { soStatus: 'Default' },
});

describe('ExpenseCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.MockedFunction<typeof useParams>).mockReturnValue({ id: '1' });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      sOData: null,
      getSOData: jest.fn().mockResolvedValue({}),
      sODataList: [],
      getSODataList: jest.fn().mockResolvedValue([]),
      updateSODataList: jest.fn(),
      isLoading: false,
      SORep: 56,
      statusChangeCallback: jest.fn(),
    };

    return renderRootProvider(<ExpenseCalculator {...defaultProps} {...props} />, { store });
  };

  test('renders Expense Calculator title', () => {
    renderComponent();
    expect(screen.getByText('EXPENSE_CALCULATOR')).toBeInTheDocument();
  });

  test('increments and decrements the number of SO', async () => {
    renderComponent();

    waitFor(() => {
      const incrementButton = screen.getByLabelText('Increment Button');
      const decrementButton = screen.getByLabelText('Decrement Button');
      fireEvent.click(incrementButton);
      fireEvent.click(decrementButton);
    });
  });

  test('Changes status from the dropdown', async () => {
    renderComponent();

    waitFor(() => {
      const statusSelect = screen.getByLabelText('Status Dropdown');
      fireEvent.mouseDown(statusSelect);
    });
  });
});
