import { screen, fireEvent, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import useWarehouseStockTurnoverReport from '@/src/hooks/useWarehouseStockTurnoverReport/useWarehouseStockTurnoverReport.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import InventoryLists from './InventoryLists';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/useWarehouseStockTurnoverReport/useWarehouseStockTurnoverReport.hook', () =>
  jest.fn()
);

global.URL.createObjectURL = jest.fn();
const mockOnClose = jest.fn();
const mockBase64Pdf =
  'JVBERi0xLjQKJeLjz9MKNCAwIG9iago8PAovUGFnZXMgMyAwIFIKL1R5cGUgL0ZsYXRlRGVzY3JpcHRvciAvUGF0dGVybiAvQ3VzdG9tIDEvUm9vdCAvSW5mbyA8PC9FbmNvZGluZyAvQ1BGL0RhdGUgTGVuZ3RoIDIwIDAgUiAvVHJpbGxlIDEvU291cmNlIDEvVGltZS9UcmFuc3BvcnQvTW9kZSAxIDAgUj4+CmVuZG9iago=';

describe('InventoryLists', () => {
  beforeEach(() => {
    (useWarehouseStockTurnoverReport as jest.Mock).mockReturnValue({
      refetch: jest.fn().mockResolvedValue({ data: mockBase64Pdf }),
      isLoading: false,
      error: null,
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the modal with form fields', () => {
    renderRootProvider(<InventoryLists onClose={mockOnClose} />, { store });

    expect(screen.getByLabelText('FROM')).toBeInTheDocument();
    expect(screen.getByLabelText('TO')).toBeInTheDocument();
    expect(screen.getByText('DOWNLOAD_AND_VIEW_LIST')).toBeInTheDocument();
    expect(screen.getByText('DISCARD')).toBeInTheDocument();
  });

  test('should show validation errors when form is submitted without dates', async () => {
    renderRootProvider(<InventoryLists onClose={mockOnClose} />, { store });

    fireEvent.click(screen.getByText('DOWNLOAD_AND_VIEW_LIST'));

    await waitFor(() => {
      const errorMessages = screen.getAllByText('FIELD_IS_REQUIRED');
      expect(errorMessages.length).toBe(2);
    });
  });

  test('should call fetchStockTurnoverReport on valid form submission', async () => {
    const fetchStockTurnoverReport = jest.fn().mockResolvedValue({ data: mockBase64Pdf });

    (useWarehouseStockTurnoverReport as jest.Mock).mockReturnValue({
      refetch: fetchStockTurnoverReport,
      isLoading: false,
      error: null,
    });

    renderRootProvider(<InventoryLists onClose={mockOnClose} />, { store });

    const fromDateInput = screen.getByLabelText('FROM');
    const toDateInput = screen.getByLabelText('TO');

    fireEvent.change(fromDateInput, { target: { value: dayjs().format('DD.MM.YYYY') } });
    fireEvent.change(toDateInput, {
      target: { value: dayjs().add(1, 'day').format('DD.MM.YYYY') },
    });

    fireEvent.click(screen.getByText('DOWNLOAD_AND_VIEW_LIST'));

    await waitFor(() => {
      expect(fetchStockTurnoverReport).toHaveBeenCalled();
    });
  });
});
