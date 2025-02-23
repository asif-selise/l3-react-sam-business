import { memo } from 'react';
import Stack from '@mui/material/Stack';
import NavList from './components/NavList/NavList';
import { type NavProps, type NavGroupProps } from '../../interfaces/types';

function NavSection({ data, ...other }: NavProps) {
  return (
    <Stack component="nav" id="nav-section" spacing={'16px'} {...other}>
      {data.map((group, index) => (
        <Group key={index} items={group.items} />
      ))}
    </Stack>
  );
}

export default memo(NavSection);

function Group({ items }: Readonly<NavGroupProps>) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title} data={list} depth={1} />
      ))}
    </>
  );
}
