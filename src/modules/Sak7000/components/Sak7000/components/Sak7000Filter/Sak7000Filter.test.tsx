import React from 'react';
import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import Sak7000Filter from './Sak7000Filter';

const mockOnFilter = jest.fn();

describe('View Orders Filter', () => {
  test('should render view orders filter component properly', async () => {
    renderRootProvider(<Sak7000Filter onFilter={mockOnFilter} />);
    expect(screen.getByLabelText('TOP')).toBeInTheDocument();
    expect(screen.getByLabelText('SEARCH')).toBeInTheDocument();
    expect(screen.getByLabelText('SEARCH_MODE')).toBeInTheDocument();
    expect(screen.getByLabelText('RS_LINE')).toBeInTheDocument();
    expect(screen.getByLabelText('AVOR')).toBeInTheDocument();
  });
});
