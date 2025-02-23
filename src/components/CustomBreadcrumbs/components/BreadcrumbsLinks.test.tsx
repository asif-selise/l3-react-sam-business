import { screen } from '@testing-library/react';
import BreadcrumbsLinks from './BreadcrumbsLinks';
import { type BreadcrumbsLinkProps } from '../interfaces/types';
import { renderRootProvider } from '../../RootProviderTest/RootProviderTest';

interface Props {
  link: BreadcrumbsLinkProps;
  activeLast?: boolean;
  disabled: boolean;
}

const mockedProps: Props = {
  link: { name: 'Home', href: '/home' },
  activeLast: false,
  disabled: false,
};

describe('Testing BreadcrumbsLinks', () => {
  test('renders a link with proper data', () => {
    renderRootProvider(<BreadcrumbsLinks {...mockedProps} />);

    const renderedLink = screen.getByRole('link');

    expect(renderedLink).toBeInTheDocument();
    expect(renderedLink).toHaveAttribute('href', '/home');
    expect(renderedLink).toHaveTextContent('Home');
  });

  test('renders a box when href is not provided', () => {
    const updatedLink = { name: 'Contact' };

    renderRootProvider(<BreadcrumbsLinks {...mockedProps} link={updatedLink} />);

    const renderedBox = screen.getByText('Contact').parentElement;

    expect(renderedBox).toBeInTheDocument();
    expect(renderedBox?.nodeName).toBe('DIV');
  });

  test('applies correct styles when disabled and not activeLast', () => {
    renderRootProvider(<BreadcrumbsLinks {...mockedProps} disabled={true} activeLast={false} />);

    const renderedLink = screen.getByRole('link');

    expect(renderedLink).toHaveStyle('cursor: default');
    expect(renderedLink).toHaveStyle('pointer-events: none');
  });
});
