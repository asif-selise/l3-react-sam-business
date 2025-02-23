import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDate } from '@/src/helpers/formatDate';
import { type IPrintTableData } from '@/src/hooks/useMasterData/masterData.interface';

interface Props {
  selectedItems: IPrintTableData[];
}

const PrintLayout = forwardRef<HTMLDivElement, Props>(({ selectedItems }, ref) => {
  const { t } = useTranslation('index');

  return (
    <div style={{ display: 'none' }} ref={ref}>
      <table>
        <thead>
          <tr>
            <th>{t('TOUR_DATE')}</th>
            <th>{t('SO_NO')}</th>
            <th>{t('TECHNICIAN_EMPLOYEE_NUMBER')}</th>
            <th>{t('FIRST_NAME')}</th>
            <th>{t('LAST_NAME')}</th>
            <th>{t('BRANCH_LOCATION')}</th>
            <th>{t('LOADING_LOCATION')}</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item, index) => (
            <tr key={index}>
              <td>{getDate(item.TourDate)}</td>
              <td>{item.Orders}</td>
              <td>{item.TechnicianEmployeeNumber}</td>
              <td>{item.FirstName}</td>
              <td>{item.LastName}</td>
              <td>{item.BranchLocation}</td>
              <td>{item.LoadingLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

PrintLayout.displayName = 'PrintLayout';

export default PrintLayout;
