import { renderRootProvider } from '../RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import MessageContent from './MessageContent';

describe('MessageContent', () => {
  it('should render the messages', () => {
    renderRootProvider(<MessageContent messages={['Message 1', 'Message 2']} />);
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });
});
