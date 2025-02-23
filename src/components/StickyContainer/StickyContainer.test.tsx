import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import StickyContainer from './StickyContainer';
import { screen } from '@testing-library/react';

describe('StickyContainer', () => {
  test('renders children correctly', () => {
    renderRootProvider(
      <StickyContainer>
        <div data-testid="child">Test Child</div>
      </StickyContainer>
    );
    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Test Child');
  });
});
