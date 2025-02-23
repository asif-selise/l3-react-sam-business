import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import { data } from './data';
import ElectronicServiceOrderTable from './ElectronicServiceOrderTable';

describe('Unit tests for Electronic Service Order table', () => {
  test('Electronic Service Order rows rendered properly', () => {
    renderRootProvider(
      <ElectronicServiceOrderTable
        data={data}
        systemUser="mahadi"
        esoFilters={{
          ESO: '',
          Special: '',
          Branch: '',
          RepSO: false,
          EsoID: '',
          SO: '',
          Remarks: '',
        }}
        onEditModalSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText('Electronic Service Order Table Row')).toBeInTheDocument();
  });
});
