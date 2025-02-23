import { TableCell, TableRow } from '@mui/material';
import { screen } from '@testing-library/react';
import { Fragment } from 'react';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import CustomTable from './CustomTable';
import { type HeadCell, type TableData } from './types';

const mockHeader: HeadCell[] = [
  {
    id: 'name',
    label: 'name',
    sortable: true,
  },
];

const tableDataMock: TableData[] = [
  {
    id: 'table data',
    label: 'table data',
  },
];

const mockSetTableData = jest.fn();

describe('Testing Custom Table', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      headCells: mockHeader,
      rows: tableDataMock,
      setTableData: mockSetTableData,
      columnVisibility: {},
      setColumnVisibility: jest.fn(),
      tableName: 'Custom Table',
      children: <Fragment />,
    };

    return renderRootProvider(<CustomTable {...defaultProps} {...props} />);
  };

  test('Should render table', () => {
    renderComponent();
    expect(screen.getByLabelText('Custom Table')).toBeInTheDocument();
  });
  test('Should render table data', () => {
    renderComponent({
      children: (
        <TableRow>
          <TableCell>{tableDataMock[0].label}</TableCell>
        </TableRow>
      ),
    });
    expect(screen.getByText('table data')).toBeInTheDocument();
  });
  test('Should Call setTableData mock', () => {
    renderComponent();
    expect(mockSetTableData).toHaveBeenCalled();
  });
});
