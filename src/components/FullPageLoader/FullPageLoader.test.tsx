import { screen } from '@testing-library/react';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import FullPageLoader from './FullPageLoader';

describe('Full Page Loader test', () => {
  test('Loader should be in the document', () => {
    renderRootProvider(<FullPageLoader />);
    expect(screen.getByLabelText('Full page loader')).toBeInTheDocument();
  });
});
