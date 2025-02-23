import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AddChanceHistory from './AddChanceHistory';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('AddChanceHistory', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onSubmitForm: jest.fn(),
      onClose: jest.fn(),
      onDiscard: jest.fn(),
    };

    return renderRootProvider(<AddChanceHistory {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('add-chance-history-form')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('ENTRANCE')).toBeInTheDocument();
    expect(screen.getByLabelText('MUST_BE_COMPLETED_BY')).toBeInTheDocument();
    expect(screen.getByLabelText('MAIL_RECEIVED_ON')).toBeInTheDocument();
  });

  it('should render the modal actions', () => {
    renderComponent();

    const buttonBack = screen.getByRole('button', { name: 'DISCARD' });
    const buttonSubmit = screen.getByRole('button', { name: 'SAVE' });

    expect(buttonBack).toBeInTheDocument();
    expect(buttonSubmit).toBeInTheDocument();
  });
});
