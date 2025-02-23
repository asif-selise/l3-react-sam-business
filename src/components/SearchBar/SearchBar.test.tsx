import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      placeholder: 'Search',
      onSearch: jest.fn(),
    };

    return renderRootProvider(<SearchBar {...defaultProps} {...props} />);
  };

  test('renders SearchBar component', () => {
    renderComponent();

    const searchBar = screen.getByLabelText('search-bar');
    expect(searchBar).toBeInTheDocument();
  });

  test('calls onSearch when input value changes', async () => {
    const onSearch = jest.fn();
    renderComponent({ onSearch });

    const input = screen.getByPlaceholderText('Search');
    await user.type(input, 'test');

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('test');
      },
      { timeout: 500 }
    );
  });
});
