import { screen, fireEvent } from '@testing-library/react';
import InfoGrid from './InfoGrid';
import { renderRootProvider } from '../RootProviderTest/RootProviderTest';

describe('Testing InfoGrid component', () => {
  test('renders label and value', () => {
    renderRootProvider(<InfoGrid label="testLabel" value="testValue" />);

    expect(screen.getByText('testLabel')).toBeInTheDocument();
    expect(screen.getByText('testValue')).toBeInTheDocument();
  });

  test('renders button and handles click event', () => {
    const handleClick = jest.fn();
    renderRootProvider(
      <InfoGrid
        label="testLabel"
        value="testValue"
        button={{ label: 'testButton', action: handleClick }}
      />
    );

    const button = screen.getByText('testButton');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
