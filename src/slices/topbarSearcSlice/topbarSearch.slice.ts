import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TopBarSearchState {
  searchValue: string;
}

const initialState: TopBarSearchState = {
  searchValue: '',
};

const topBarSearchSlice = createSlice({
  name: 'topBarSearch',
  initialState,
  reducers: {
    updateTopBarSearchState: (state, { payload }: PayloadAction<string>) => {
      state.searchValue = payload;
    },
  },
});
export const { updateTopBarSearchState } = topBarSearchSlice.actions;
export default topBarSearchSlice;
