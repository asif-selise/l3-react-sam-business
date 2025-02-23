import { Box, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { type MouseEvent } from 'react';
import { type HeadCell, type Order } from '../../types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';

interface CustomTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  headCells: HeadCell[];
  columnVisibility: Record<string, boolean>;
}

const CustomTableHead = ({
  order,
  orderBy,
  onRequestSort,
  headCells,
  columnVisibility,
}: CustomTableProps) => {
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead aria-label="Custom Table Head">
      <TableRow>
        {headCells.map(
          (headCell) =>
            columnVisibility[headCell.id] && (
              <TableCell
                key={headCell.id}
                align={headCell?.align ?? 'left'}
                padding={'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.sortable ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    <OverflowTooltip text={headCell.label} />
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={{ display: 'none' }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  <Typography variant="body2" sx={{ textAlign: headCell?.align ?? 'left' }}>
                    <OverflowTooltip text={headCell.label} />
                  </Typography>
                )}
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHead;
