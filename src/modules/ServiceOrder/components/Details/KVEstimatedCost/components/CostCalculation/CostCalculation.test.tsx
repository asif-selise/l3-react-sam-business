import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import CostCalculation from './CostCalculation';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

jest.mock('@/src/helpers/formatDateByLuxon', () => ({
  getMillis: jest.fn().mockReturnValue(1483369),
  getUtcCurrentDateTime: jest.fn().mockReturnValue('2021-08-27T00:00:00.000Z'),
}));

describe('CostCalculation', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      readOnly: false,
      setReadOnly: jest.fn(),
      setReadOnlyMsg: jest.fn(),
      dataKv: null,
      dataMaterials: [],
      dataWorkflowDetail: null,
      dataCurrentUserRightToFrontendAlls: [],
      onSubmitForm: jest.fn(),
    };

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<CostCalculation {...defaultProps} {...props} />);
  };

  it('should render the title', () => {
    renderComponent();

    expect(screen.getByText('TOTAL_MATERIALS_INCLUDE_SMALL_PARTES_ET')).toBeInTheDocument();
  });

  it('should render the form', () => {
    renderComponent();

    expect(screen.getByText('WORK_FRANCS_MINUTE')).toBeInTheDocument();
    expect(screen.getByText('ET_PROCESSING_COSTS')).toBeInTheDocument();
    expect(screen.getByText('REMARKS')).toBeInTheDocument();
  });
});
