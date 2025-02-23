import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { type SnackbarNotification } from '../../components/CustomSnackbar/types';
import { resizeSnackbarQueue } from '../../components/CustomSnackbar/utils';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    snackbarQueue: [] as SnackbarNotification[],
  },
  reducers: {
    showSuccessMessage: (state, { payload }: PayloadAction<string>) => ({
      snackbarQueue: [
        { key: uuidv4(), title: payload, type: 'success', isVisible: true },
        ...resizeSnackbarQueue(state.snackbarQueue),
      ],
    }),
    showErrorMessage: (state, { payload }: PayloadAction<string>) => ({
      snackbarQueue: [
        { key: uuidv4(), title: payload, type: 'error', isVisible: true },
        ...resizeSnackbarQueue(state.snackbarQueue),
      ],
    }),
    showWarningMessage: (state, { payload }: PayloadAction<string>) => ({
      snackbarQueue: [
        { key: uuidv4(), title: payload, type: 'warning', isVisible: true },
        ...resizeSnackbarQueue(state.snackbarQueue),
      ],
    }),
    hideSnackbar: (state, { payload }: PayloadAction<string>) => {
      const updatedQueue = state.snackbarQueue.filter((data) => data.key !== payload);
      return { snackbarQueue: updatedQueue };
    },
  },
});

export const { showSuccessMessage, showErrorMessage, hideSnackbar, showWarningMessage } =
  snackbarSlice.actions;
export default snackbarSlice;
