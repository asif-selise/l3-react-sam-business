import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { alpha, styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import { type NavItemProps, type NavItemStateProps } from '../../../../../../interfaces/types';
import { Typography } from '@mui/material';
import Iconify from '@/src/components/iconify/iconify';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
      title,
      path,
      icon,
      info,
      disabled,
      caption,
      open,
      depth,
      active,
      hasChild,
      externalLink,
      ...other
    },
    ref
  ) => {
    const subItem = depth !== 1;

    const renderContent = (
      <StyledNavItem
        disableGutters
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {icon && (
          <Box component="span" className="icon">
            {icon}
          </Box>
        )}

        {title && (
          <Typography className="label" variant="body3">
            {title}
          </Typography>
        )}

        {caption && (
          <Tooltip title={caption} arrow placement="right">
            <Iconify width={16} icon="eva:info-outline" className="caption" />
          </Tooltip>
        )}

        {info && subItem && (
          <Box component="span" className="info">
            {info}
          </Box>
        )}

        {hasChild && <Iconify width={16} className="arrow" icon="eva:arrow-ios-forward-fill" />}
      </StyledNavItem>
    );

    const linkStyles = {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'inherit',
      '&:hover': {
        textDecoration: 'none',
      },
      ...(disabled && {
        cursor: 'default',
      }),
    };

    if (externalLink) {
      return (
        <Box component="a" href={path} target="_blank" rel="noopener" sx={linkStyles}>
          {renderContent}
        </Box>
      );
    }

    return (
      <Box sx={linkStyles}>
        <Link
          to={path}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {renderContent}
        </Link>
      </Box>
    );
  }
);

export default NavItem;

const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavItemStateProps>(({ active, open, depth, theme }) => {
  const subItem = depth !== 1;

  const opened = open && !active;

  const lightMode = theme.palette.mode === 'light';

  const noWrapStyles = {
    width: '100%',
    maxWidth: '100%',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  } as const;

  const baseStyles = {
    item: {
      borderRadius: 6,
      color: theme.palette.text.secondary,
    },
    icon: {
      width: 22,
      height: 22,
      flexShrink: 0,
    },
    label: {
      textTransform: 'capitalize',
    },
    caption: {
      color: theme.palette.text.disabled,
    },
  } as const;

  return {
    // Root item
    ...(!subItem && {
      ...baseStyles.item,
      fontSize: 10,
      minHeight: 56,
      lineHeight: '16px',
      textAlign: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(0.5),
      margin: theme.spacing(0, 0.5),
      fontWeight: 360,
      '& .icon': {
        ...baseStyles.icon,
      },
      '& .label': {
        ...noWrapStyles,
        ...baseStyles.label,
        marginTop: theme.spacing(0.5),
      },
      '& .caption': {
        ...baseStyles.caption,
        top: 11,
        left: 6,
        position: 'absolute',
      },
      '& .arrow': {
        top: 11,
        right: 6,
        position: 'absolute',
      },
      ...(active && {
        fontWeight: theme.typography.fontWeightBold,
        backgroundColor: theme.palette.grey[200],
        color: lightMode ? theme.palette.primary.main : theme.palette.primary.light,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      }),
      ...(opened && {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,
      }),
    }),
  };
});

//need to work here
