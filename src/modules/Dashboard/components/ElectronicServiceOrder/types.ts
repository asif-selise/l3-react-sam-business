export interface EditESOFields {
  UId: string;
  ID: string;
  ESO: string;
  SO: string;
  Remarks: string;
  OrderTime: 'Before' | 'After';
  Comments: string;
  CreatedBy: string;
  CreatedOn: string;
  AssignedBy: string;
  AssignedOn: string;
  ChangedBy: string;
  ChangedOn: string;
  DoneBy: string;
  DoneOn: string;
}

export interface CreateESOFields {
  FilterESO: string;
  NewESO: {
    Id: number;
    TypeItem: string;
  } | null;
  SO: number | null;
  Remarks: string;
}

export interface ESOFilterFields {
  ESO: string;
  Special: string;
  Branch: string;
  RepSO: boolean;
  EsoID: string;
  SO: string;
  Remarks: string;
}

export const SPEACIAL_FILTER = {
  OpenAll: 'Offene Alle',
  OpenWithoutSO: 'Offene ohne SO',
  OpenFromMeAll: 'Offene von mir Alle',
  CreatedByMe: 'Von mir erstellt',
  OpenCreatedByMe: 'Offene von mir erstellt',
};

export const SPECIAL = [
  { id: 1, value: SPEACIAL_FILTER.OpenAll },
  { id: 2, value: SPEACIAL_FILTER.OpenWithoutSO },
  { id: 3, value: SPEACIAL_FILTER.OpenFromMeAll },
  { id: 4, value: SPEACIAL_FILTER.CreatedByMe },
  { id: 5, value: SPEACIAL_FILTER.OpenCreatedByMe },
];

export const BRANCH = [
  { id: 1, value: 'Oberbüren' },
  { id: 2, value: 'Netstal' },
  { id: 3, value: 'Wangen' },
  { id: 4, value: 'Uznach' },
  { id: 5, value: 'S7-2' },
];
