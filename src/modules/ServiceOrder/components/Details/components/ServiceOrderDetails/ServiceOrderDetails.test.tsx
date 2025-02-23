import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import ServiceOrderDetails from './ServiceOrderDetails';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'index:ADMINISTRATORS') return 'ADMINISTRATORS';
      else if (key === 'index:ADMINISTRATOR_PROFILES') return 'ADMINISTRATOR_PROFILES';
      return key;
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

describe('Testing ServiceOrderDetails', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      serviceOrderData: null,
      getServiceOrderData: jest.fn(),
      setServiceOrderDetailsLoaded: jest.fn(),
    };

    return renderRootProvider(<ServiceOrderDetails {...defaultProps} />);
  };

  test('should render customer details component properly', () => {
    renderComponent();
    expect(screen.getByLabelText('Service Order Details')).toBeInTheDocument();
    expect(screen.getByText('SERVICE_ORDER')).toBeInTheDocument();
    expect(screen.getByText('SHIFT')).toBeInTheDocument();
  });

  test('should display Administrator profiles button', () => {
    renderComponent();

    const adminButton = screen.getByRole('button', { name: 'ADMINISTRATORS' });

    expect(adminButton).toBeInTheDocument();
  });

  test('admin button should display Administrator profiles modal', async () => {
    renderComponent();

    const adminButton = screen.getByRole('button', { name: 'ADMINISTRATORS' });
    await user.click(adminButton);

    const dialogTitle = screen.getByRole('heading', { name: 'ADMINISTRATOR_PROFILES' });

    expect(dialogTitle).toBeInTheDocument();
  });
});
