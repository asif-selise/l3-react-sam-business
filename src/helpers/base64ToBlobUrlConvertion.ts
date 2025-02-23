export const base64ToBlobUrl = (base64String: string): string => {
  const byteCharacters = atob(base64String);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
};
