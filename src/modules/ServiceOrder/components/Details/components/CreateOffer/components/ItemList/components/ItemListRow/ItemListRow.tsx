import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { TableCell, TableRow } from '@mui/material';

interface Props {
  description: string;
  oldDevice: React.ReactNode;
  newDevice: React.ReactNode;
  article: React.ReactNode;
  grossExcl: React.ReactNode;
  modifiedOn: React.ReactNode;
  modifiedBy: React.ReactNode;
}

const ItemListRow = ({
  description,
  oldDevice,
  newDevice,
  article,
  grossExcl,
  modifiedOn,
  modifiedBy,
}: Props) => {
  return (
    <TableRow>
      <TableCell>
        <OverflowTooltip text={description} />
      </TableCell>
      <TableCell>{oldDevice}</TableCell>
      <TableCell>{newDevice}</TableCell>
      <TableCell>{article}</TableCell>
      <TableCell>{grossExcl}</TableCell>
      <TableCell>{modifiedOn}</TableCell>
      <TableCell>{modifiedBy}</TableCell>
    </TableRow>
  );
};

export default ItemListRow;
