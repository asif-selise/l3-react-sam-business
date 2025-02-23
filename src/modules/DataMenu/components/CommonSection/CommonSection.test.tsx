import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import CommonSection from './CommonSection';
import testIcon from '@/public/assets/icons/ic_order.svg';

describe('CommonSection Component', () => {
  const header = {
    title: 'Header Title',
    onClick: jest.fn(),
  };

  const actionCards = [
    {
      icon: testIcon,
      title: 'Action Card Title',
      onClick: jest.fn(),
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      header,
      actionCards,
    };

    return renderRootProvider(<CommonSection {...defaultProps} {...props} />);
  };

  test('renders CommonSection component', () => {
    renderComponent();

    expect(screen.getByText(header.title)).toBeInTheDocument();
    expect(screen.getByLabelText('action-cards')).toBeInTheDocument();
  });
});
