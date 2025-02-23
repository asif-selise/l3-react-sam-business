import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import CustomDropdown from './CustomDropdown';

describe('CustomDropdown Component', () => {
  const anchorEl = document.createElement('div');
  const onClose = jest.fn();
  const children = <div>Children</div>;
  const header = {
    title: 'Custom Dropdown Title',
    button: {
      label: 'Apply',
      action: jest.fn(),
    },
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      anchorEl,
      onClose,
      header,
      children,
    };

    return renderRootProvider(<CustomDropdown {...defaultProps} {...props} />);
  };

  test('renders CustomDropdown component', () => {
    renderComponent();

    const popover = screen.getByLabelText('custom-dropdown');
    const title = screen.getByText(header.title);

    expect(popover).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test('renders children', () => {
    renderComponent();

    const childrenElement = screen.getByText('Children');

    expect(childrenElement).toBeInTheDocument();
  });

  test('calls action when button is clicked', async () => {
    renderComponent();

    const buttonAction = screen.getByRole('button', { name: header.button.label });

    await user.click(buttonAction);

    expect(header.button.action).toHaveBeenCalledTimes(1);
  });
});
