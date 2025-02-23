import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import testIcon from '@/public/assets/icons/ic_order.svg';
import ActionCard from './ActionCard';

describe('ActionCard Component', () => {
  const icon = testIcon;
  const title = 'Action Card Title';
  const onClick = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      icon,
      title,
      onClick,
    };

    return renderRootProvider(<ActionCard {...defaultProps} {...props} />);
  };

  test('renders ActionCard component', () => {
    renderComponent();

    expect(screen.getByRole('img', { name: title })).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', async () => {
    renderComponent();

    const card = screen.getByLabelText(title);

    await user.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
