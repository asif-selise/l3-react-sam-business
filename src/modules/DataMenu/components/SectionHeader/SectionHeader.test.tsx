import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import SectionHeader from './SectionHeader';

describe('SectionHeader Component', () => {
  const title = 'Section Header Title';
  const onClick = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      title,
      onClick,
    };

    return renderRootProvider(<SectionHeader {...defaultProps} {...props} />);
  };

  test('renders SectionHeader component', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });

  test('does not render arrow icon when onClick is not defined', () => {
    renderComponent({ onClick: undefined });

    expect(screen.queryByText('arrow-right-up')).not.toBeInTheDocument();
  });
});
