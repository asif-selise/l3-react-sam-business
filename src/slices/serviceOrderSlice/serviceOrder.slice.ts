import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ServiceOrderState {
  id: number;
}

const initialState: ServiceOrderState = {
  id: 0,
};

const serviceOrderSlice = createSlice({
  name: 'serviceOrder',
  initialState,
  reducers: {
    updateServiceOrderState: (state, { payload }: PayloadAction<number>) => {
      state.id = payload;
    },
  },
});
export const { updateServiceOrderState } = serviceOrderSlice.actions;
export default serviceOrderSlice;
