import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';

let dispatch: any | null = null;

export const dispatchErrorMessage = (errorMsg: string): void => {
  if (!dispatch) {
    return;
  }
  dispatch(showErrorMessage(errorMsg));
};

export const setDispatch = (dpatch: any | null) => {
  dispatch = dpatch;
};
