import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Synchronization {
  status: 'initial' | 'uploading' | 'downloading' | 'downloaded';
  loading: boolean;
  selectedDate: string;
  autoSync: boolean;
  online: boolean;
}

const initialState = {
  sync: {
    status: 'initial',
    loading: false,
    selectedDate: new Date().toISOString().split('T')[0],
    autoSync: false,
    online: true,
  },
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    updateSyncStatus: (state, { payload }: PayloadAction<Partial<Synchronization>>) => {
      state.sync = { ...state.sync, ...payload };
    },
  },
});

export const { updateSyncStatus } = syncSlice.actions;
export default syncSlice;
