import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import SettingsSection from './SettingsSection';

describe('SettingsSection Component', () => {
  const renderComponent = () => {
    return renderRootProvider(<SettingsSection />);
  };

  test('renders SettingsSection component', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'SETTINGS' })).toBeInTheDocument();
    expect(screen.getAllByText('SETTINGS')).toHaveLength(2);
  });
});
