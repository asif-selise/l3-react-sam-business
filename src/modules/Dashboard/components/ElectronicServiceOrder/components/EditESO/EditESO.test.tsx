import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import EditESO from './EditESO';

describe('EditESO Component', () => {
  const onCloseEditESO = jest.fn();
  const onSumitEditESO = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: {},
      isDisabled: false,
      onClose: onCloseEditESO,
      onSumitForm: onSumitEditESO,
    };

    return renderRootProvider(<EditESO {...defaultProps} {...props} />);
  };

  test('renders EsoCreate Form component', () => {
    renderComponent();

    const esoCreate = screen.getByLabelText('eso-create-form');

    expect(esoCreate).toBeInTheDocument();
  });

  test('calls onCloseEditESO when DISCARD button is clicked', async () => {
    renderComponent();

    const buttonClose = screen.getByRole('button', { name: 'DISCARD' });

    await user.click(buttonClose);

    expect(onCloseEditESO).toHaveBeenCalledTimes(1);
  });

  test('calls onSumitEditESO when SAVE button is clicked and form is filled with required fields', async () => {
    renderComponent();

    const FieldID = screen.getByLabelText('ID');
    await user.type(FieldID, 'test text');

    const FieldESO = screen.getByLabelText('ESO');
    await user.type(FieldESO, 'test text');

    const FieldSO = screen.getByLabelText('SO');
    await user.type(FieldSO, 'test text');

    const buttonSubmit = screen.getByRole('button', { name: 'SAVE' });
    await user.click(buttonSubmit);

    expect(onSumitEditESO).toHaveBeenCalledTimes(1);
  });
});
