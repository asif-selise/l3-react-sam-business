import { screen, fireEvent } from '@testing-library/react';
import MessageListComponent from './MessageListComponent';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

describe('MessageListComponent', () => {
  const mockMessageList: AutoText[] = [
    { Id: 1, Group: 1, SubGroup: null, Name: 'Test Message 1', NameInGerman: 'Test Nachricht 1' },
    { Id: 2, Group: 1, SubGroup: null, Name: 'Test Message 2', NameInGerman: 'Test Nachricht 2' },
    { Id: 3, Group: 1, SubGroup: null, Name: 'Another Message', NameInGerman: 'Andere Nachricht' },
  ];

  let mockSetSelectedItem: jest.Mock;

  beforeEach(() => {
    mockSetSelectedItem = jest.fn();
  });

  test('renders the component properly', () => {
    renderRootProvider(
      <MessageListComponent
        title="Test Title"
        messageList={mockMessageList}
        selectedItem=""
        setSelectedItem={mockSetSelectedItem}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('SEARCH')).toBeInTheDocument();
  });

  test('displays the list of messages and allows item selection', () => {
    renderRootProvider(
      <MessageListComponent
        title="Test Title"
        messageList={mockMessageList}
        selectedItem=""
        setSelectedItem={mockSetSelectedItem}
      />
    );

    expect(screen.getByText('Test Message 1')).toBeInTheDocument();
    expect(screen.getByText('Test Message 2')).toBeInTheDocument();
    expect(screen.getByText('Another Message')).toBeInTheDocument();

    const firstItem = screen.getByText('Test Message 1');
    fireEvent.click(firstItem);

    expect(mockSetSelectedItem).toHaveBeenCalledWith('Test Message 1');
  });

  test('filters the list based on the search input', () => {
    renderRootProvider(
      <MessageListComponent
        title="Test Title"
        messageList={mockMessageList}
        selectedItem=""
        setSelectedItem={mockSetSelectedItem}
      />
    );

    const searchInput = screen.getByPlaceholderText('SEARCH');
    fireEvent.change(searchInput, { target: { value: 'Another' } });

    expect(screen.getByText('Another Message')).toBeInTheDocument();
    expect(screen.queryByText('Test Message 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Message 2')).not.toBeInTheDocument();
  });

  // test('highlights the selected item', () => {
  //   renderRootProvider(
  //     <MessageListComponent
  //       title="Test Title"
  //       messageList={mockMessageList}
  //       selectedItem="Test Message 2"
  //       setSelectedItem={mockSetSelectedItem}
  //     />
  //   );

  //   const selectedItem = screen.getByText('Test Message 2');
  //   expect(selectedItem).toHaveClass('selected');
  // });
});
