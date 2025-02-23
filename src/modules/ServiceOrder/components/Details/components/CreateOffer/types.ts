import { type SamOfferDetail } from '@/src/hooks/useTourData/tourData.interface';
import { type ControlsRow } from '@/src/modules/ServiceOrder/components/Details/components/CreateOffer/Interfaces/ControlsRow';

export type PartKind = 'Altgeraet' | 'Neugeraet' | 'Preis';
export type EditControlType = 'TextBox' | 'ComboBox' | 'Button';
export type ButtonEvent = 'Article' | 'Geraet' | 'None';
export interface EditControl {
  Type: EditControlType;
  Text: string | null;
  DataSource?: string[] | null;
  DataContext: SamOfferDetail | null;
  isReadOnly?: boolean | null;
  isEnabled?: boolean | null;
  isRequired?: boolean;
  buttonEventType?: ButtonEvent;
}

export interface GridEditControl {
  RowDescription: EditControl | null;
  OldDeviceAnswer: EditControl | null; // "Altgerät / Antwort"
  NewDeviceAdditional: EditControl | null; // "Neugerät / Zusatz"
  Article: EditControl | null; // Artikels
  GrossExcl: EditControl | null; // Brutto exkl.
  ModifiedOn: EditControl | null; // Geändert am
  ModifiedBy: EditControl | null; // von
  ControlRow: ControlsRow | null; // ControlsRow[]
}

export interface OfferDimensionField {
  label: string;
  name: string;
  top: string | null;
  left: string | null;
}
export interface ImageFieldData {
  ucLinks?: React.ReactNode;
  ucMitte?: React.ReactNode;
  ucRechts?: React.ReactNode;
  title: string;
  fields: OfferDimensionField[];
}

export interface FieldCombination {
  id: number;
  for: number | number[];
  images: ImageFieldData[];
}
