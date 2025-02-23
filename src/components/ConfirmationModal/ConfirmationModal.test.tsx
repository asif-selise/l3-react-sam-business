import { screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';

describe('ConfirmationModal', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    details: 'Are you sure you want to proceed?',
    discardButton: {
      title: 'Discard',
      actionId: 1,
      action: jest.fn(),
    },
    primaryActionButton: {
      title: 'Confirm',
      actionId: 2,
      action: jest.fn(),
    },
    secondaryActionButton: {
      title: 'Secondary',
      actionId: 12,
      action: jest.fn(),
    },
  };

  test('should render with title, details and buttons', () => {
    renderRootProvider(<ConfirmationModal {...defaultProps} />);

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('should call discardButton action on click', () => {
    renderRootProvider(<ConfirmationModal {...defaultProps} />);

    const discardButton = screen.getByText('Discard');
    fireEvent.click(discardButton);

    expect(defaultProps.discardButton.action).toHaveBeenCalled();
  });

  test('should call primaryActionButton action on click', () => {
    renderRootProvider(<ConfirmationModal {...defaultProps} />);

    const primaryButton = screen.getByText('Confirm');
    fireEvent.click(primaryButton);

    expect(defaultProps.primaryActionButton.action).toHaveBeenCalled();
  });

  test('should call secondaryActionButton action on click', () => {
    renderRootProvider(<ConfirmationModal {...defaultProps} />);

    const secondaryButton = screen.getByText('Secondary');
    fireEvent.click(secondaryButton);

    expect(defaultProps.secondaryActionButton.action).toHaveBeenCalled();
  });
});
