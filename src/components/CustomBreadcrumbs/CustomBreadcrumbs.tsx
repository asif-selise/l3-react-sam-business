import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { type CustomBreadcrumbsProps } from './interfaces/types';
import BreadcrumbsLinks from './components/BreadcrumbsLinks';
import Iconify from '../iconify/iconify';

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}

export default function CustomBreadcrumbs({
  links,
  buttons,
  backButton,
  heading,
  activeLast,
  sx,
}: Readonly<CustomBreadcrumbsProps>) {
  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ ...sx }} aria-label="Custom Breadcrumb" mb={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'middle' }}>
            {backButton && (
              <Iconify
                icon={'ic:round-arrow-back-ios'}
                sx={{
                  width: '32px',
                  height: '32px',
                  ml: '-6px',
                  mr: 2,
                  color: 'primary.main',
                  cursor: 'pointer',
                }}
                onClick={backButton?.action}
              />
            )}
            {heading && (
              <Typography variant="h4" gutterBottom>
                {heading}
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {!!links.length && (
              <Breadcrumbs separator={<Separator />}>
                {links.map((link) => (
                  <BreadcrumbsLinks
                    key={link.name}
                    link={link}
                    activeLast={activeLast}
                    disabled={link.name === lastLink}
                  />
                ))}
              </Breadcrumbs>
            )}
          </Box>
        </Box>

        {buttons && <Box sx={{ flexShrink: 0 }}> {buttons} </Box>}
      </Stack>
    </Box>
  );
}
