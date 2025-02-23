import { useState, forwardRef, useImperativeHandle } from 'react';
import ESO from '@/src/modules/Dashboard/components/ElectronicServiceOrder/components/ESO/ESO';
import { useSelector } from 'react-redux';

const ESOHistory = forwardRef((_, ref) => {
  const soId = useSelector((state: any) => state.serviceOrder.id);

  const [openCreateESO, setOpenCreateESO] = useState(false);

  useImperativeHandle(ref, () => ({
    handleOpenCreateESO: () => {
      setOpenCreateESO(true);
    },
  }));

  return <ESO soId={soId} openCreateESO={openCreateESO} setOpenCreateESO={setOpenCreateESO} />;
});

ESOHistory.displayName = 'ESOHistory';

export default ESOHistory;
