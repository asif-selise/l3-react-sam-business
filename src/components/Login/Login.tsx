import { loginRequest } from '@/src/configs/authConfig';
import { useMsal } from '@azure/msal-react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullPageLoader from '../FullPageLoader/FullPageLoader';
import MicrosoftIcon from './../../../public/assets/icons/microsoft.svg';
import LoginBackground from './../../../public/assets/images/login-cover.png';
import Logo from './../../../public/assets/images/login-logo.png';
import useOrderWGAData from '@/src/hooks/useOrdersWGAData/useOrderWGAData';
import axios from '@/src/configs/axiosConfig';
import type { ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import environment from '@/environment';
import { setData } from '@/indexedDb';
import { type TechnicianInfo } from './type';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation('index');
  const { instance } = useMsal();
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['isAuthenticated']);
  const navigate = useNavigate();
  const { initializeData } = useOrderWGAData();

  useEffect(() => {
    if (checkHashForCode()) {
      const setTokenInterval = setInterval(async () => {
        instance.setActiveAccount(instance.getAllAccounts()[0]);
        const account = instance.getActiveAccount();
        if (account !== null) {
          if (account?.idToken) {
            localStorage.setItem('accessToken', account.idToken);
            localStorage.setItem('tokenDate', new Date().toISOString());
          }
          clearInterval(setTokenInterval);
          await setTechnicianData(account.username.split('@')[0]);
          await initializeData();
          navigate('/sam/dashboard');
        }
      }, 300);
    } else {
      setLoading(false);
    }
  }, [instance, navigate]);

  // useEffect(() => {
  //   const isAuth = getCookie('isAuthenticated');
  //   if (isAuth === 'true') {
  //     setLoading(true);
  //   }
  // }, []);
  useEffect(() => {
    const isAuth = cookies.isAuthenticated;
    if (isAuth === 'true') {
      setLoading(true);
    }
  }, [cookies]);

  const setTechnicianData = async (loginame: string) => {
    const res = axios.get<ApiResponse<TechnicianInfo>>(
      `${environment.serviceBusiness}/Query/GetSystemUserData?LoginUserName=${loginame}`
    );
    const { data } = await res;
    const technicianData: TechnicianInfo = data.Data;
    await setData('technicianData', technicianData);
  };

  const checkHashForCode = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      return params.has('code');
    }
    return false;
  };

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    // setCookie('isAuthenticated', 'true', { path: '/' });
    // navigate('/dashboard');
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <Grid container>
      <Grid
        item
        mobile={0}
        tablet={6}
        desktop={7}
        height="100vh"
        sx={{
          display: { mobile: 'none', tablet: 'flex' },
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            zIndex: 1,
            width: '136px',
            height: '40px',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${LoginBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
      <Grid
        item
        mobile={12}
        tablet={6}
        desktop={5}
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={3}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }} maxWidth="380px" mx="auto">
          <Typography variant="h4" mb={2}>
            {t('SIGN_IN_TO_SAM')}
          </Typography>
          <Typography variant="body2">{t('WELCOME_MESSAGE')}</Typography>
        </Box>

        <Button
          onClick={handleLogin}
          startIcon={
            <Box
              component="img"
              src={MicrosoftIcon}
              alt={'Microsoft'}
              sx={{ width: 24, height: 24 }}
            />
          }
          sx={{
            maxWidth: '380px',
            mx: 'auto',
            mt: 6.5,
            py: 1.5,
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0056A4',
            px: '8px !important',
            '&:hover': {
              background: '#0056A4',
            },
          }}
        >
          <Typography variant="subtitle1" mt={'3px'} color="#fff">
            {t('LOGIN_WITH_MICROSOFT')}
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
