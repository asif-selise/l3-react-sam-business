import React from 'react';
import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ViewOrdersFilter from './ViewOrdersFilter';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    dataList: [],
    getDataList: jest.fn(),
  })),
}));

const mockOnFilter = jest.fn();

describe('View Orders Filter', () => {
  test('should render view orders filter component properly', async () => {
    renderRootProvider(<ViewOrdersFilter onFilter={mockOnFilter} />);

    expect(screen.getAllByText('ORDER_NO_S7000').length).toBe(2);
    expect(screen.getAllByText('SO').length).toBe(2);
    expect(screen.getAllByText('ARTICLE_NUMBER').length).toBe(2);
    expect(screen.getAllByText('ARTICLE_REFERENCE').length).toBe(2);
    expect(screen.getAllByText('OPEN_ORDERS').length).toBe(1);
  });
});
