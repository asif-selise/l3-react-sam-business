import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import CustomModalActions from './CustomModalActions';

describe('CustomModalActions Component', () => {
  const actions = [
    { label: 'Button 1', onClick: jest.fn() },
    { label: 'Button 2', onClick: jest.fn() },
    { label: 'Button 3', onClick: jest.fn() },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      actions,
    };

    return render(<CustomModalActions {...defaultProps} {...props} />);
  };

  test('renders the correct number of buttons', () => {
    renderComponent();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(actions.length);
  });

  test('calls the correct onClick function when a button is clicked', async () => {
    renderComponent();

    const buttons = screen.getAllByRole('button');

    await user.click(buttons[0]);
    expect(actions[0].onClick).toHaveBeenCalledTimes(1);

    await user.click(buttons[1]);
    expect(actions[1].onClick).toHaveBeenCalledTimes(1);

    await user.click(buttons[2]);
    expect(actions[2].onClick).toHaveBeenCalledTimes(1);
  });
});
