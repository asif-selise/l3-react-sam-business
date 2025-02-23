import ActionTile from './ActionTile';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';

const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

describe('ActionTile', () => {
  test('renders ActionTile component properly', () => {
    renderRootProvider(
      <ActionTile heading="HEADING_KEY" subHeading="SUBHEADING_KEY" icon={<MockIcon />} />
    );

    expect(screen.getByText('HEADING_KEY')).toBeInTheDocument();
    expect(screen.getByText('SUBHEADING_KEY')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
});
