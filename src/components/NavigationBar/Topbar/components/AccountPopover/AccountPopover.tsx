import { varHover } from '@/src/components/Animate/Actions';
import CustomPopover from '@/src/components/CustomPopover/CustomPopover';
import usePopover from '@/src/components/CustomPopover/usePopover';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

export default function AccountPopover() {
  const { t } = useTranslation('index');
  const popover = usePopover();
  const { instance, accounts } = useMsal();
  const [displayName, setDisplayName] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['isAuthenticated']);

  useEffect(() => {
    if (accounts?.[0]?.name) {
      setDisplayName(accounts[0].name);
    }
  }, [accounts]);

  const stringAvatar = (name: string) => {
    return {
      children:
        name
          .split(' ')
          .slice(0, 2)
          .reduce((acc, item) => `${acc}${item.charAt(0).toUpperCase()}`, '') ?? name.charAt(0),
    };
  };

  const avatarComponent = (
    <Avatar
      alt={displayName}
      sx={{
        width: 40,
        height: 40,
        fontSize: '16px',
        border: (theme) => `solid 2px ${theme.palette.background.default}`,
      }}
      {...stringAvatar(displayName)}
    />
  );

  const handleLogout = async () => {
    setCookie('isAuthenticated', 'false');
    localStorage.removeItem('accessToken');
    instance.logoutRedirect({
      postLogoutRedirectUri: '/login',
    });
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        {avatarComponent}
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 240, p: 0 }}>
        <Box
          sx={{
            m: '16px',
            p: '16px 20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: '12px',
            bgcolor: alpha(COMMON.grey[500], 0.08),
          }}
        >
          {avatarComponent}

          <Box ml={'16px'}>
            <Typography variant="subtitle2">{displayName}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {accounts?.[0]?.authorityType ?? ''}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, pb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            {t('index:LOGOUT')}
          </Button>
        </Box>
      </CustomPopover>
    </>
  );
}

// need to work here
