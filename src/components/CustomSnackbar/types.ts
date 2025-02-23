export interface SnackbarNotification {
  key: string;
  title: string;
  type: 'error' | 'success' | 'warning';
  isVisible: boolean;
}
