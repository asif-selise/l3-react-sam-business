import { useSelector } from '@/src/redux/store';
import { Box } from '@mui/material';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import LoaderOverlay from '../LoaderOverlay/LoaderOverlay';
import SideBar from '../NavigationBar/Sidebar/SideBar';
import Topbar from '../NavigationBar/Topbar/Topbar';
import { NAV } from '../NavigationBar/configLayout';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { setMsalInstance } from '@/globalServices/msalService';
import { setDispatch } from '@/globalServices/commonService';

interface Props {
  children: ReactNode;
}

const LayoutTemplate = ({ children }: Props) => {
  const { sync: syncStatus } = useSelector((state) => state.sync);
  const [progress, setProgress] = useState(0);
  const { sync: syncState } = useSelector((state) => state.sync);
  const { syncData } = useAutoSync();
  const { instance } = useMsal();
  const dispatch = useDispatch();

  useEffect(() => {
    setMsalInstance(instance);
  }, [instance]);

  useEffect(() => {
    setDispatch(dispatch);
  }, []);

  useEffect(() => {
    if (syncState.autoSync) {
      syncData();
    }
  }, [syncState.autoSync]);

  useEffect(() => {
    if (syncStatus.loading) {
      const timer = setInterval(() => {
        if (syncStatus.status === 'uploading') {
          const uploadingMax = 50;
          const uploadingExpectedMax = 40;
          setProgress((prevProgress) => {
            let updatedProgress = prevProgress;
            if (uploadingMax > prevProgress) {
              updatedProgress =
                prevProgress < uploadingExpectedMax ? prevProgress + 5 : prevProgress + 1;
            }
            return updatedProgress;
          });
        }
        if (syncStatus.status === 'downloading') {
          const downloadingMax = 99;
          const downloadingExpectedMax = 90;
          setProgress((prevProgress) => {
            let updatedProgress = prevProgress;
            if (prevProgress < 50) {
              return 50;
            }
            if (downloadingMax > prevProgress) {
              updatedProgress =
                prevProgress < downloadingExpectedMax ? prevProgress + 5 : prevProgress + 1;
            }
            return updatedProgress;
          });
        }
      }, 300);
      return () => {
        clearInterval(timer);
      };
    }
    if (syncStatus.status === 'downloaded') {
      setProgress(0);
    }
  }, [syncStatus]);

  return (
    <>
      {(syncStatus.status === 'uploading' || syncStatus.status === 'downloading') && (
        <LoaderOverlay title={syncStatus.status} progress={progress} />
      )}
      <CustomSnackbar />
      <Box maxWidth="99vw" aria-label="template layout">
        <Suspense>
          <Topbar />
        </Suspense>
        <SideBar />
        <Box
          sx={{
            ml: `${NAV.W_MINI + 1}px`,
            py: 2,
            px: 5,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default LayoutTemplate;
