import { type GridEditControl } from '../types';

export interface GeraetGrupe {
  ProductGroupNumbers: number[]; // ProduktegruppeNrn
  Manufacture: number; // MarkeEigenschaftId
  Model: number; // ModellEigenschaftId
  SerialNumber: number; // SerieNummerEigenschaftId
  ProductionNumber: number; // ProduktionsNummerEigenschaftId
  Year: number; // JahrgangEigenschaftId
  Color: number; // FarbeEigenschaftId
  Binding: number; // BandungEigenschaftId
  HasBinding: boolean; // hatBandung
  ManufactureControlRow?: GridEditControl | null; // Marke
  ModelControlRow?: GridEditControl | null; // Modell
  ColorControlRow?: GridEditControl | null; // Farbe
  BindingControlRow?: GridEditControl | null; // Bandung
}
