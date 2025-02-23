import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import LanguageSettings from '../../LanguageSettings/LanguageSettings';
import AccountPopover from './components/AccountPopover/AccountPopover';
import ConnectionPopover from './components/ConnectionPopover/ConnectionPopover';
import TopBarSearch from './components/TopBarSearch/TopBarSearch';
import { NAV } from '../configLayout';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Toolbar
      sx={{
        height: 1,
        py: 2,
        ml: `${NAV.W_MINI + 1}px`,
      }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
        {pathname.endsWith('/sam/dashboard') && <TopBarSearch />}
        {pathname.endsWith('/sam/dashboard') && <ConnectionPopover />}
        <LanguageSettings />
        <AccountPopover />
      </Stack>
    </Toolbar>
  );
}

//need to work here
