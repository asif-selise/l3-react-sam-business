import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CountState {
  amount: number;
}

const initialState: CountState = {
  amount: 0,
};

const countSlice = createSlice({
  name: 'countState',
  initialState,
  reducers: {
    updateCount: (state, { payload }: PayloadAction<CountState>) => {
      state.amount = payload.amount;
    },
  },
});

export const { updateCount } = countSlice.actions;

export default countSlice;
