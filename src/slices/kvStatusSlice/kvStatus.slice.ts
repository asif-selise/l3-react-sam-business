import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface KvStatusState {
  hasKV: boolean;
}

const initialState: KvStatusState = {
  hasKV: false,
};

const kvStatusSlice = createSlice({
  name: 'kvStatus',
  initialState,
  reducers: {
    updateKvStatus: (state, { payload }: PayloadAction<KvStatusState>) => {
      state.hasKV = payload.hasKV;
    },
  },
});

export const { updateKvStatus } = kvStatusSlice.actions;

export default kvStatusSlice;
