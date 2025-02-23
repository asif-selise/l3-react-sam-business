import { screen } from '@testing-library/react';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import LayoutTemplate from './LayoutTemplate';
import configureMockStore from 'redux-mock-store';

jest.mock('react-router-dom', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue(''),
  useSearchParams: jest.fn(),
}));

jest.mock('../CustomSnackbar/CustomSnackbar', () => {
  const Mock = () => <div data-testid="custom-snackbar">Custom Snackbar</div>;
  Mock.displayName = 'CustomSnackbar';
  return Mock;
});

jest.mock('../LoaderOverlay/LoaderOverlay', () => {
  const Mock = () => <div data-testid="loader-overlay">Loader Overlay</div>;
  Mock.displayName = 'LoaderOverlay';
  return Mock;
});

jest.mock('../NavigationBar/Topbar/Topbar', () => {
  const Mock = () => <div data-testid="topbar">Topbar</div>;
  Mock.displayName = 'Topbar';
  return Mock;
});

jest.mock('../NavigationBar/Sidebar/SideBar', () => {
  const Mock = () => <div data-testid="sidebar">Sidebar</div>;
  Mock.displayName = 'Sidebar';
  return Mock;
});

jest.mock('@azure/msal-react', () => {
  return {
    useIsAuthenticated: jest.fn(),
    useMsal: jest.fn().mockReturnValue({
      instance: {},
    }),
  };
});

describe('Layout template tests', () => {
  const renderComponent = (props = {}) => {
    const store = configureMockStore()({
      snackbar: {
        snackbarQueue: [
          {
            key: 'snackbar_id_1',
            isVisible: true,
            type: 'success',
            title: 'Success snackbar',
          },
          {
            key: 'snackbar_id_2',
            isVisible: true,
            type: 'error',
            title: 'Error snackbar',
          },
        ],
      },
      sync: {
        sync: {
          status: 'initial',
          loading: false,
          selectedDate: new Date().toISOString().split('T')[0],
          autoSync: false,
          online: true,
        },
      },
    });

    const defaultProps = {
      children: <span>Children</span>,
    };
    return renderRootProvider(<LayoutTemplate {...defaultProps} {...props} />, { store });
  };

  test('Layout template rendered correctly', () => {
    renderComponent();
    expect(screen.getByLabelText('template layout')).toBeInTheDocument();
  });
  test('Layout template children rendered correctly', () => {
    renderComponent();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});
