import { getFileExtension } from './fileExtension';

export const constructBase64Image = (photoName: string, base64String: string) => {
  const fileExtension = getFileExtension(photoName);
  return `data:image/${fileExtension};base64,${base64String}`;
};
