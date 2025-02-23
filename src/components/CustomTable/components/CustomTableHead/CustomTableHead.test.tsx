import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import { type HeadCell } from '../../types';
import CustomTableHead from './CustomTableHead';

const mockHeader: HeadCell[] = [
  {
    id: 'name',
    label: 'dummy name',
    sortable: true,
  },
];

const orderMock = 'asc';
const orderByMock = 'name';

const mockedOnRequestSort = jest.fn();

describe('Testing Custom Head component', () => {
  test('Should render table head element', () => {
    renderRootProvider(
      <CustomTableHead
        headCells={mockHeader}
        order={orderMock}
        orderBy={orderByMock}
        onRequestSort={mockedOnRequestSort}
        columnVisibility={{ name: true }}
      />
    );
    expect(screen.getByLabelText('Custom Table Head')).toBeInTheDocument();
  });

  test('Should render table head with header cell name', () => {
    renderRootProvider(
      <CustomTableHead
        headCells={mockHeader}
        order={orderMock}
        orderBy={orderByMock}
        onRequestSort={mockedOnRequestSort}
        columnVisibility={{ name: true }}
      />
    );
    expect(screen.getByText('dummy name')).toBeInTheDocument();
  });
});
