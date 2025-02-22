import { type Theme } from '@mui/material/styles';
import { tabClasses } from '@mui/material/Tab';

export function tabs(theme: Theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        scrollButtons: {
          width: 48,
          borderRadius: '50%',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 0,
          opacity: 1,
          minWidth: 48,
          minHeight: 48,
          fontWeight: 700,
          textTransform: 'none',
          fontFamily: 'RT Rondelle Bold',
          '&:not(:last-of-type)': {
            marginRight: theme.spacing(3),
            [theme.breakpoints.up('mobile')]: {
              marginRight: theme.spacing(3),
            },
          },
          [`&:not(.${tabClasses.selected})`]: {
            color: theme.palette.text.secondary,
            fontFamily: 'RT Rondelle Book',
          },
        },
      },
    },
  };
}
