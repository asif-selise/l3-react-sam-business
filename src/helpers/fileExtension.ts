import imageIcon from '@/public/assets/icons/ic_img.svg';
import pdfIcon from '@/public/assets/icons/ic_pdf.svg';
import documentIcon from '@/public/assets/icons/ic_document.svg';
import zipIcon from '@/public/assets/icons/ic_zip.svg';
import txtIcon from '@/public/assets/icons/ic_txt.svg';
import wordIcon from '@/public/assets/icons/ic_word.svg';
import excelIcon from '@/public/assets/icons/ic_excel.svg';

const iconFileMap: Record<string, string> = {
  jpg: imageIcon,
  jpeg: imageIcon,
  png: imageIcon,
  gif: imageIcon,
  pdf: pdfIcon,
  doc: wordIcon,
  docx: wordIcon,
  xls: excelIcon,
  xlsx: excelIcon,
  txt: txtIcon,
  zip: zipIcon,
  rar: zipIcon,
};

export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const getFileIcon = (fileName: string) => {
  const extension = getFileExtension(fileName);
  return iconFileMap[extension] || documentIcon;
};
