import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import CustomModal from './CustomModal';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import CustomModalActions from './CustomModalActions/CustomModalActions';

describe('CustomModal Component', () => {
  const open = true;
  const onClose = jest.fn();
  const title = 'Custom Modal Title';
  const children = <div>Children</div>;
  const actions = (
    <CustomModalActions
      actions={[
        {
          label: 'Close',
          onClick: onClose,
        },
        {
          label: 'Submit',
          onClick: jest.fn(),
        },
      ]}
    />
  );

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open,
      onClose,
      title,
      children,
      actions,
    };

    return renderRootProvider(<CustomModal {...defaultProps} {...props} />);
  };

  test('renders CustomModal component', () => {
    renderComponent();

    const formDialog = screen.getByLabelText('custom-modal');
    const dialogTitle = screen.getByText(title);

    expect(dialogTitle).toBeInTheDocument();
    expect(formDialog).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    renderComponent();

    const buttonClose = screen.getByRole('button', { name: 'Close' });

    await user.click(buttonClose);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders children', () => {
    renderComponent();

    const childrenComponent = screen.getByText('Children');

    expect(childrenComponent).toBeInTheDocument();
  });

  test('renders buttonTopRight when buttonTopRight prop is passed', () => {
    const buttonTopRight = {
      label: 'Button Top Right',
      onClick: jest.fn(),
    };

    renderComponent({ buttonTopRight });

    const buttonTopRightComponent = screen.getByRole('button', { name: buttonTopRight.label });

    expect(buttonTopRightComponent).toBeInTheDocument();
  });
});
