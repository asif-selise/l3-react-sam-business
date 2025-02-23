import { type BreadcrumbsProps } from '@mui/material/Breadcrumbs';

export interface BreadcrumbsLinkProps {
  name: string;
  href?: string;
  icon?: React.ReactElement;
}

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: string;
  activeLast?: boolean;
  buttons?: React.ReactNode;
  backButton?: { title?: string; action: () => void };
  links: BreadcrumbsLinkProps[];
}
