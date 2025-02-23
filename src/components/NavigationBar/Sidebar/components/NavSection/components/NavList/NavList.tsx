import { useRef, useState, useEffect, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import { type NavListProps, type NavSubListProps } from '../../../../interfaces/types';
import NavItem from './components/NavItem/NavItem';
import { useActiveLink } from '../../../../hooks/useActiveLink';
import { useLocation } from 'react-router-dom';

export default function NavList({ data, depth }: Readonly<NavListProps>) {
  const navRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const active = useActiveLink(data.path);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(true);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <NavItem
        ref={navRef}
        open={openMenu}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
        title={data.title}
        path={data.path}
        icon={data.icon}
        info={data.info}
        caption={data.caption}
        disabled={data.disabled}
        depth={depth}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        active={active}
      />

      {!!data.children && (
        <Popover
          disableScrollLock
          open={openMenu}
          anchorEl={navRef.current}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          slotProps={{
            paper: {
              onMouseEnter: handleOpenMenu,
              onMouseLeave: handleCloseMenu,
              sx: {
                mt: 0.5,
                minWidth: 160,
                ...(openMenu && {
                  pointerEvents: 'auto',
                }),
              },
            },
          }}
          sx={{
            pointerEvents: 'none',
          }}
        >
          <NavSubList data={data.children} depth={depth} />
        </Popover>
      )}
    </>
  );
}

function NavSubList({ data, depth, slotProps }: Readonly<NavSubListProps>) {
  return (
    <Stack spacing={0.5}>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </Stack>
  );
}

//need to work here
