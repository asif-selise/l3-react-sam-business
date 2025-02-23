import Box from '@mui/material/Box';

import { type BreadcrumbsLinkProps } from '../interfaces/types';
import { Link } from 'react-router-dom';

interface Props {
  link: BreadcrumbsLinkProps;
  activeLast?: boolean;
  disabled: boolean;
}

export default function BreadcrumbsLinks({ link, activeLast, disabled }: Readonly<Props>) {
  const styles = {
    typography: 'body2',
    alignItems: 'center',
    color: 'text.disabled',
    display: 'inline-flex',
    textDecoration: 'none',
    ...(disabled &&
      !activeLast && {
        cursor: 'default',
        pointerEvents: 'none',
        color: 'text.primary',
      }),
    '&:hover': {
      textDecoration: 'none',
    },
  };

  const renderContent = (
    <>
      {link.icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            display: 'inherit',
            '& svg': { width: 20, height: 20 },
          }}
        >
          {link.icon}
        </Box>
      )}

      {link.name}
    </>
  );

  if (link.href) {
    return (
      <Box component={Link} to={link.href} sx={styles} aria-label="BreadcrumbLinks">
        {renderContent}
      </Box>
    );
  }

  return <Box sx={styles}> {renderContent} </Box>;
}
