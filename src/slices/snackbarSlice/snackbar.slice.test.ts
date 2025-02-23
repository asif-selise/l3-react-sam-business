import { store } from '@/src/redux/store';
import { showErrorMessage, showSuccessMessage } from './snackbar.slice';

test('should be empty by default', () => {
  const state = store.getState().snackbar.snackbarQueue;
  expect(state.length).toBeFalsy();
});

test('should show success toast', () => {
  store.dispatch(showSuccessMessage('success toast'));
  const isVisible = store.getState().snackbar.snackbarQueue[0].isVisible;
  const type = store.getState().snackbar.snackbarQueue[0].type;
  expect(isVisible).toBeTruthy();
  expect(type).toBe('success');
});

test('should show error toast', () => {
  store.dispatch(showErrorMessage('error toast'));
  const type = store.getState().snackbar.snackbarQueue[0].type;
  expect(type).toBe('error');
});
