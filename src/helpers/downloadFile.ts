export const downloadFile = async (fileBinary: string, fileName: string) => {
  const link = document.createElement('a');

  link.href = `data:application/octet-stream;base64,${fileBinary}`;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
