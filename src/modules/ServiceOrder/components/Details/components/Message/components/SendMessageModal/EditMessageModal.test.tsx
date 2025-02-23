import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import EditMessageModal from './EditMessageModal';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

describe('EditMessageModal Component', () => {
  const mockOnDiscard = jest.fn();
  const mockOnSaveChanges = jest.fn();

  const defaultProps = {
    open: true,
    onDiscard: mockOnDiscard,
    onSaveChanges: mockOnSaveChanges,
    reportMessage: 'Initial Report Message',
    invoiceMessage: 'Initial Invoice Message',
    setInvoiceMessage: jest.fn(),
    setReportMessage: jest.fn(),
    isEBSO: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders EditMessageModal correctly', () => {
    renderRootProvider(<EditMessageModal {...defaultProps} />);

    expect(screen.getByText('MESSAGE')).toBeInTheDocument();
    expect(screen.getByText('REPORT_TEXT')).toBeInTheDocument();
    expect(screen.getByText('INVOICE_TEXT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Report Message')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Invoice Message')).toBeInTheDocument();
  });

  test('calls onSaveChanges when save button is clicked in edit view', async () => {
    renderRootProvider(<EditMessageModal {...defaultProps} />);

    const saveButton = screen.getByText('SAVE');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSaveChanges).toHaveBeenCalledWith({
        FaultReportOrderSupplement: 'Initial Report Message',
        FaultReport: 'Initial Invoice Message',
      });
    });
  });

  test('clears report message when clear button is clicked for report', () => {
    renderRootProvider(<EditMessageModal {...defaultProps} />);

    const clearReportMessageButton = screen.getAllByText('CLEAR_MESSAGE')[0];
    fireEvent.click(clearReportMessageButton);

    expect(screen.queryByDisplayValue('Initial Report Message')).not.toBeInTheDocument();
  });

  test('calls onDiscard when discard button is clicked', () => {
    renderRootProvider(<EditMessageModal {...defaultProps} />);

    const discardButton = screen.getByText('DISCARD');
    fireEvent.click(discardButton);

    expect(mockOnDiscard).toHaveBeenCalled();
  });
});
