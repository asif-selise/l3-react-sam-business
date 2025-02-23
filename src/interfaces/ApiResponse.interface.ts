export interface ApiResponse<SuccessResponse> {
  StatusCode: number;
  ErrorMessage: string | null;
  Message: string | null;
  Data: SuccessResponse;
  TotalCount: number;
}
