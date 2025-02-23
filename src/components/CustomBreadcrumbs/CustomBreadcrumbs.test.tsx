import '@testing-library/jest-dom';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import { type CustomBreadcrumbsProps } from './interfaces/types';
import CustomBreadcrumbs from './CustomBreadcrumbs';
import { screen } from '@testing-library/react';
import { Button } from '@mui/material';

const mockedProps: CustomBreadcrumbsProps = {
  links: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  buttons: <Button>Click Here</Button>,
  heading: 'Breadcrumb Heading',
  activeLast: false,
};

describe('Testing CustomBreadcrumbs', () => {
  test('renders with proper heading and button', () => {
    renderRootProvider(<CustomBreadcrumbs {...mockedProps} />);

    expect(screen.getByLabelText('Custom Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Breadcrumb Heading')).toBeInTheDocument();
    expect(screen.getByText('Click Here')).toBeInTheDocument();
  });
});
