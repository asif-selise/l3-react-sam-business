import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const SO_STATUS = {
  Default: 'Default',
  Modified: 'Modified',
  ReadOnly: 'ReadOnly',
  Locked: 'Locked',
} as const;

interface SoStatusState {
  soStatus: keyof typeof SO_STATUS | null;
  offerServiceOrder: boolean;
}

const initialState: SoStatusState = {
  soStatus: null,
  offerServiceOrder: false,
};

const soStatusSlice = createSlice({
  name: 'soStatus',
  initialState,
  reducers: {
    updateSoStatus: (state, action: PayloadAction<Partial<SoStatusState>>) => {
      if (action.payload.soStatus !== undefined) {
        state.soStatus = action.payload.soStatus;
      }
      if (action.payload.offerServiceOrder !== undefined) {
        state.offerServiceOrder = action.payload.offerServiceOrder;
      }
    },
  },
});

export const { updateSoStatus } = soStatusSlice.actions;

export default soStatusSlice;
