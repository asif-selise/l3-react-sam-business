import { screen } from '@testing-library/react';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import OverflowTooltip from './OverflowTooltip';

test('check overflow tooltip component', () => {
  renderRootProvider(<OverflowTooltip text={'Test data'} variant="body2" />);

  expect(screen.getByText('Test data')).toBeInTheDocument();
});
