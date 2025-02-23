import Iconify from '@/src/components/iconify/iconify';
import { type RootState } from '@/src/redux/store';
import { Box, InputAdornment, InputBase } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showWarningMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { updateTopBarSearchState } from '@/src/slices/topbarSearcSlice/topbarSearch.slice';
import useNetworkStatus from '@/src/hooks/useNetworkStatus/useNetworkStatus';
import { useTranslation } from 'react-i18next';

export default function TopBarSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const topBarSearchValue = useSelector((state: RootState) => state.topBarSearch.searchValue);
  const { checkOnlineStatus } = useNetworkStatus();
  const [searchQuery, setSearchQuery] = useState(topBarSearchValue);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  useEffect(() => {
    if (topBarSearchValue === '') {
      setSearchQuery('');
    }
  }, [topBarSearchValue]);

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const isOnline = await checkOnlineStatus();
        if (!isOnline) {
          dispatch(showWarningMessage(t('APP_IS_OFFLINE')));
          return;
        }
        dispatch(updateTopBarSearchState(searchQuery));
      }
    },
    [searchQuery]
  );

  return (
    <Box
      sx={{
        width: {
          tablet: '20%',
          desktop: '60%',
        },
        flexGrow: 1,
        ml: 3,
      }}
    >
      <InputBase
        fullWidth
        autoFocus
        type="number"
        placeholder={t('SEARCH_SERVICE_ORDER') ?? ''}
        onChange={handleSearch}
        value={searchQuery}
        onKeyDown={handleKeyDown}
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              width={20}
              sx={{ color: 'text.secondary', cursor: 'pointer' }}
              onClick={async () => {
                const isOnline = await checkOnlineStatus();
                if (!isOnline) {
                  dispatch(showWarningMessage(t('APP_IS_OFFLINE')));
                  return;
                }
                dispatch(updateTopBarSearchState(searchQuery));
              }}
            />
          </InputAdornment>
        }
        sx={{
          '& input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
          },
        }}
      />
    </Box>
  );
}
