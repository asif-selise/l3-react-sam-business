import { type SnackbarNotification } from './types';

const snackbarLimit = 3;
export const resizeSnackbarQueue = (queue: SnackbarNotification[]): SnackbarNotification[] =>
  queue.length > snackbarLimit - 1 ? queue.slice(0, snackbarLimit - 1) : queue;
