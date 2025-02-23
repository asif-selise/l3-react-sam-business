import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import CustomListItem from './CustomListItem';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';

describe('CustomListItem', () => {
  const mockItem: AutoText = {
    Id: 1,
    Group: 1,
    SubGroup: null,
    Name: 'Test Message',
    NameInGerman: 'Test Nachricht',
  };

  let mockOnClick: jest.Mock;

  beforeEach(() => {
    mockOnClick = jest.fn();
  });

  test('renders the list item with given text', () => {
    renderRootProvider(<CustomListItem item={mockItem} isSelected={false} onClick={mockOnClick} />);

    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('applies selected styling when the item is selected', () => {
    const { container } = renderRootProvider(
      <CustomListItem item={mockItem} isSelected={true} onClick={mockOnClick} />
    );

    const listItem = container.querySelector('li');
    expect(listItem).toHaveStyle(`background-color: ${COMMON.grey[300]}`);
  });

  test('calls onClick when the item is clicked', () => {
    renderRootProvider(<CustomListItem item={mockItem} isSelected={false} onClick={mockOnClick} />);

    const listItem = screen.getByText('Test Message');
    fireEvent.click(listItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('applies hover styling when the item is hovered', () => {
    const { container } = renderRootProvider(
      <CustomListItem item={mockItem} isSelected={false} onClick={mockOnClick} />
    );

    const listItem = container.querySelector('li');

    if (listItem) {
      fireEvent.mouseOver(listItem);
      expect(listItem).toHaveStyle(`background-color: ${COMMON.grey[200]}`);
    } else {
      throw new Error('List item not found');
    }
  });
});
