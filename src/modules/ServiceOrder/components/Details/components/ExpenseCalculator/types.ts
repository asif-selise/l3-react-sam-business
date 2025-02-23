export type StatusModalType =
  | 'verrechnen-status'
  | 'empty-personal-expenses'
  | 'non-answered-checklist'
  | 'siko-aouthorized-s'
  | 'siko-aouthorized-gm'
  | 'has-empty-taken-over-user'
  | '';

export interface StatusModalData {
  modalType: StatusModalType;
  message: string;
}
