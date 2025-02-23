export interface CustomerDetailsFields {
  firstName: string;
  lastName1: string;
  lastName2: string;
  street: string;
  apartmentNumber: string;
  apartmentNo: string;
  apartmentDetails: string;
  poBox: string; // Since this is the result of concatenating CustomerZip and CustomerCity, it needs to be a string type.
  telephone: string;
  telephoneBusiness: string;
  email: string;
  smsNumber: string;
  contactPerson: string;
  contactNumber: string;
}
