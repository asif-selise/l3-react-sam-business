import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import FilterQRCode from './FilterQRCode';

describe('FilterQRCode Component', () => {
  const anchorEl = document.createElement('div');
  const onClose = jest.fn();
  const onApply = jest.fn();
  const filterData = {
    TopRecordNumber: 50,
    IsInactive: null,
    ObjectId: null,
    ApartmentId: null,
    SerialNumber: null,
    Filter: null,
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      anchorEl,
      onClose,
      onApply,
      filterData,
    };

    return renderRootProvider(<FilterQRCode {...defaultProps} {...props} />);
  };

  test('renders FilterQRCode component', () => {
    renderComponent();

    const title = screen.getByText('FILTERS');
    const buttonApply = screen.getByRole('button', { name: 'APPLY' });

    expect(title).toBeInTheDocument();
    expect(buttonApply).toBeInTheDocument();
  });

  test('renders fields', () => {
    renderComponent();

    const showInactiveDevices = screen.getByText('SHOW_INACTIVE_DEVICES');
    const top = screen.getByLabelText('TOP');
    const objectId = screen.getByLabelText('OBJECT_ID');
    const whgId = screen.getByLabelText('WHG_ID');

    expect(showInactiveDevices).toBeInTheDocument();
    expect(top).toBeInTheDocument();
    expect(objectId).toBeInTheDocument();
    expect(whgId).toBeInTheDocument();
  });
});
