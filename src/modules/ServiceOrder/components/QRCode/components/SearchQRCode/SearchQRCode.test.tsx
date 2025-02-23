import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import SearchQRCode from './SearchQRCode';

describe('SearchQRCode Component', () => {
  const renderComponent = () => {
    return renderRootProvider(<SearchQRCode />);
  };

  test('renders SearchQRCode component', () => {
    renderComponent();

    const buttonFilter = screen.getByRole('button', { name: 'FILTER' });
    const buttonClear = screen.getByRole('button', { name: 'CLEAR' });

    expect(screen.getByPlaceholderText('SEARCH_QR_CODE')).toBeInTheDocument();
    expect(screen.getByText('QR_CODE_HISTORY')).toBeInTheDocument();
    expect(buttonFilter).toBeInTheDocument();
    expect(buttonClear).toBeInTheDocument();
  });

  test('opens filter dropdown when filter button is clicked', async () => {
    renderComponent();

    const buttonFilter = screen.getByRole('button', { name: 'FILTER' });

    await user.click(buttonFilter);

    const buttonApply = screen.getByRole('button', { name: 'APPLY' });

    expect(screen.getByText('FILTERS')).toBeInTheDocument();
    expect(buttonApply).toBeInTheDocument();
  });

  test('clears search field when clear button is clicked', async () => {
    renderComponent();

    const searchField = screen.getByPlaceholderText('SEARCH_QR_CODE');
    const buttonClear = screen.getByRole('button', { name: 'CLEAR' });

    await user.type(searchField, 'mahadi97');
    await user.click(buttonClear);

    expect(searchField).toHaveValue('');
  });
});
