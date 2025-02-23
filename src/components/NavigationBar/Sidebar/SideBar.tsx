import { NAV } from '@/src/components/NavigationBar/configLayout';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Service7000Logo from '../../../../public/assets/icons/nav_logo.svg';
import NavSection from './components/NavSection/NavSection';
import { useNavData } from './hooks/useNavData';
import { hideScroll } from '@/src/theme/css';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  const navData = useNavData();
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        flexShrink: 0,
        pb: 2,
        height: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: NAV.W_MINI,
        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
        ...hideScroll.x,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'inline-flex',
          mx: 'auto',
          mb: '16px',
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate('/');
        }}
      >
        <Box
          component="img"
          src={Service7000Logo}
          alt="company logo"
          sx={{
            width: 40,
            height: 'auto',
          }}
        />
      </Box>

      <NavSection data={navData} />
    </Stack>
  );
}

// need to work here bring icons and logo
