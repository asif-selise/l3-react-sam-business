import i18nConfig, { type Locale } from '@/src/configs/i18n.config';
import { setCookie } from '@/src/helpers/setCookie';
import { Menu, MenuItem, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
//   useLocation,
//   useNavigate,
// } from 'react-router-dom';
import { useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import usePopover from '@/src/components/CustomPopover/usePopover';
import Iconify from '../iconify/iconify';
import CustomPopover from '../CustomPopover/CustomPopover';
import { varHover } from '../Animate/Actions';

interface Language {
  locale: Locale;
  label: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { locale: 'en', label: 'English', flag: 'flagpack:gb-nir' },
  { locale: 'de', label: 'German', flag: 'flagpack:de' },
  // { locale: 'fr', label: 'French', flag: 'flagpack:fr' },
  // { locale: 'it', label: 'Italian', flag: 'flagpack:it' },
  // { locale: 'es', label: 'Spanish', flag: 'flagpack:es' },
  // { locale: 'pt', label: 'Portuguese', flag: 'flagpack:pt' },
  // { locale: 'sq', label: 'Albanian', flag: 'flagpack:al' },
  // { locale: 'tr', label: 'Turkish', flag: 'flagpack:tr' },
  // { locale: 'sl', label: 'Slovenian', flag: 'flagpack:sl' },
];

const LanguageSettings = () => {
  // const navigate = useNavigate();
  const popover = usePopover();
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(i18n.language);
  // const location = useLocation();
  // const currentPathname = location.pathname;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getCurrentFlag = (locale: string) => {
    const language = LANGUAGES.find((lang) => lang.locale === locale);
    return language ? language.flag : '';
  };

  const handleChange = (value: string) => {
    setCookie('NEXT_LOCALE', value);
    setCurrentLocale(value);
    // let searchParams = '';
    // if (params) {
    //   searchParams = `?${params.toString()}`;
    // }
    // if (currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
    //   navigate('/' + value + currentPathname + searchParams);
    // } else {
    //   const path = currentPathname.replace(`/${currentLocale}`, `/${value}`);
    //   const updatedPathname = `${path}${searchParams}`;
    //   navigate(updatedPathname);
    // }
    // window.location.reload();
  };

  const closeMenu = () => {
    setAnchorEl(null);
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
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={getCurrentFlag(currentLocale)} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>
      <Typography variant="subtitle2" color="primary" ml={-1} mr={2}>
        {currentLocale.toUpperCase()}
      </Typography>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {LANGUAGES.map((item: Language) => (
          <MenuItem
            value={item.locale}
            key={item.locale}
            onClick={() => {
              handleChange(item.locale);
            }}
            aria-label={`locale-${item.locale}`}
          >
            <Iconify icon={item.flag} sx={{ borderRadius: 0.65, width: 28 }} />
            <Typography>{item.label}</Typography>
          </MenuItem>
        ))}
      </CustomPopover>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        aria-label="Settings Menu"
      >
        {LANGUAGES.map((item: Language) => (
          <MenuItem
            value={item.locale}
            key={item.locale}
            onClick={() => {
              handleChange(item.locale);
            }}
            aria-label={`locale-${item.locale}`}
          >
            <Typography>{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSettings;
