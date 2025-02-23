import { useEffect } from 'react';
import { useDispatch } from '@/src/redux/store';
import { updateSyncStatus } from '@/src/slices/syncSlice/sync.slice';
import isOnline from 'is-online';

const useNetworkStatus = () => {
  const dispatch = useDispatch();

  const checkOnlineStatus = async () => {
    const options = { timeout: 500 };
    const connection: boolean = await isOnline(options);
    return connection;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const status = await checkOnlineStatus();
      dispatch(updateSyncStatus({ online: status }));
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return { checkOnlineStatus };
};

export default useNetworkStatus;
