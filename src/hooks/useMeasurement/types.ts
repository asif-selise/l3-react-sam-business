export interface MeasurementResult {
  status: string;
  message: string;
}

export interface SocketResponse {
  Command: number;
  StepMessage: string;
  Message: string;
  Result: boolean;
  ResultText: string;
  Resultxml: string;
}

export interface SocketRequest {
  Command: number;
  Port: number;
  TechnicianName: string | undefined;
  TestSequenceNumber: number;
  UserConfirmation: boolean;
}
