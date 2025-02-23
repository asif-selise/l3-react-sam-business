const actionRecords = { InsertRecords: [], UpdateRecords: [], DeleteRecords: [] };

export const updateDataStructure = {
  Id: '',
  SyncDate: '',
  SystemUserWithoutDomain: '',
  ApartmentDetailsUpdateRequestModel: actionRecords,
  DeviceDiscardUpdateRequestModel: actionRecords,
  InstallationChecklistUpdateRequestModel: actionRecords,
  OrderDevicesUpdateRequestModel: actionRecords,
  PersonalEffortsUpdateRequestModel: actionRecords,
  ReplaceQRCodeLabelUpdateRequestModel: actionRecords,
  SamOfferDetailsUpdateRequestModel: actionRecords,
  SamOffersUpdateRequestModel: actionRecords,
  SamKvDetailsUpdateRequestModel: actionRecords,
  SamKvTimeFramesUpdateRequestModel: actionRecords,
  SamKvsUpdateRequestModel: actionRecords,
  SamOfferProductDetailsUpdateRequestModel: actionRecords,
  SamOrderWgaUploadOnlyUpdateRequestModel: actionRecords,
  SamOrdersUpdateRequestModel: actionRecords,
  ServiceOrderComplaintsUpdateRequestModel: actionRecords,
  ServiceOrderComplaintDetailsUpdateRequestModel: actionRecords,
  ServiceOrderDetailsUpdateRequestModel: actionRecords,
  TechnicianLogsUpdateRequestModel: actionRecords,
  UsersSamOrdersUpdateRequestModel: actionRecords,
  WoodOrderDetailsUpdateRequestModel: actionRecords,
  WoodOrdersUpdateRequestModel: actionRecords,
  WorkflowDetailsUpdateRequestModel: actionRecords,
  AppointmentsUpdateRequestModel: actionRecords,
};

export const updateDataModel = (
  Id: string,
  SyncDate: string,
  SystemUserWithoutDomain: string,
  TechnicianId?: number,
  TechnicianEmployeeNumber?: number
) => {
  return {
    ...updateDataStructure,
    Id,
    SyncDate,
    SystemUserWithoutDomain,
    TechnicianId,
    TechnicianEmployeeNumber,
  };
};
