import { screen, fireEvent } from '@testing-library/react';
import AdditionalText from './AdditionalText';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('../CustomListItem/CustomListItem', () => ({
  __esModule: true,
  default: ({ item, isSelected, onClick }: any) => (
    <div
      data-testid={`list-item-${item.Id}`}
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? 'lightgray' : 'transparent',
        cursor: 'pointer',
      }}
    >
      {item.Name}
    </div>
  ),
}));

describe('AdditionalText component', () => {
  const mockAdditionalTextList: AutoText[] = [
    { Id: 1, Group: 1, SubGroup: null, Name: 'First Item', NameInGerman: 'Erster Artikel' },
    { Id: 2, Group: 1, SubGroup: null, Name: 'Second Item', NameInGerman: 'Zweiter Artikel' },
  ];

  const mockSetSelectedItem = jest.fn();

  test('renders properly with the provided props', () => {
    renderRootProvider(
      <AdditionalText
        additionalTextList={mockAdditionalTextList}
        selectedItem="First Item"
        setSelectedItem={mockSetSelectedItem}
      />
    );

    expect(screen.getByText('ADDITIONAL_TEXT')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('SEARCH')).toBeInTheDocument();
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });

  test('filters the list based on search input', () => {
    renderRootProvider(
      <AdditionalText
        additionalTextList={mockAdditionalTextList}
        selectedItem="First Item"
        setSelectedItem={mockSetSelectedItem}
      />
    );

    const searchInput = screen.getByPlaceholderText('SEARCH');
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.queryByText('Second Item')).not.toBeInTheDocument();
  });

  test('updates selected item when an item is clicked', () => {
    renderRootProvider(
      <AdditionalText
        additionalTextList={mockAdditionalTextList}
        selectedItem="First Item"
        setSelectedItem={mockSetSelectedItem}
      />
    );

    fireEvent.click(screen.getByTestId('list-item-2'));

    expect(mockSetSelectedItem).toHaveBeenCalledWith('Second Item');
  });

  // test('chunks the items into multiple boxes', () => {
  //   const largeList = Array.from({ length: 20 }, (_, i) => ({
  //     Id: i + 1,
  //     Group: 1,
  //     SubGroup: null,
  //     Name: `Item ${i + 1}`,
  //     NameInGerman: `Artikel ${i + 1}`,
  //   }));

  //   renderRootProvider(
  //     <AdditionalText
  //       additionalTextList={largeList}
  //       selectedItem=""
  //       setSelectedItem={mockSetSelectedItem}
  //     />
  //   );

  //   const boxes = screen.getAllByRole('list');
  //   expect(boxes.length).toBeGreaterThan(1);
  // });
});
