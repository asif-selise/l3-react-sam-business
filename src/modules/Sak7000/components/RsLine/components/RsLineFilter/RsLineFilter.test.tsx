import React from 'react';
import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import RsLineFilter from './RsLineFilter';

const mockOnFilter = jest.fn();

describe('View Orders Filter', () => {
  test('should render view orders filter component properly', async () => {
    renderRootProvider(<RsLineFilter onFilter={mockOnFilter} />);
    expect(screen.getByLabelText('CHALLENGE')).toBeInTheDocument();
    expect(screen.getByLabelText('FROM')).toBeInTheDocument();
    expect(screen.getByLabelText('TO')).toBeInTheDocument();
    expect(screen.getByLabelText('DONE_BY')).toBeInTheDocument();
    expect(screen.getByLabelText('PRODUCT_GROUP_NO')).toBeInTheDocument();
    expect(screen.getByLabelText('ORDER_NO')).toBeInTheDocument();
    expect(screen.getByLabelText('MANUFACTURER_NO')).toBeInTheDocument();
    expect(screen.getByLabelText('RSLINE_ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Remarks')).toBeInTheDocument();
  });
});
