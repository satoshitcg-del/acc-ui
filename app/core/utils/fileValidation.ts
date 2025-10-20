export const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/bmp',
  // Documents
  'application/msword', // doc
  'application/vnd.ms-word.document.macroEnabled.12', // docm
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/pdf',
  'text/plain',
  // Presentations
  'application/vnd.ms-powerpoint', // ppt
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12', // pptm
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  // Spreadsheets
  'text/csv',
  'application/vnd.ms-excel', // xls
  'application/vnd.ms-excel.sheet.macroEnabled.12', // xlsm
];

export const isValidFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_FILE_SIZE_3MB = 3 * 1024 * 1024; // 3MB
export const MAX_FILES_COUNT = 20;
export const MAX_FILES_10 = 10;
export const MAX_FILES = 50;

export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const isValidFilesCount = (currentFiles: number, newFilesCount: number): boolean => {
  return (currentFiles + newFilesCount) <= MAX_FILES_COUNT;
};

export const FILE_EXTENSION_TO_TYPE: Record<string, string> = {
  // Images
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.bmp': 'image/bmp',
  // Documents
  '.doc': 'application/msword',
  '.docm': 'application/vnd.ms-word.document.macroEnabled.12',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  // Presentations
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptm': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Spreadsheets
  '.csv': 'text/csv',
  '.xls': 'application/vnd.ms-excel',
  '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
};

export const IMAGES_FILE_TYPES = ['.jpeg', '.jpg', '.gif', '.png', '.bmp']
export const DOCUMENT_FILE_TYPES = ['.doc', '.docm', '.docx', '.pdf', '.txt']
export const PRESENTATION_FILE_TYPES = ['.ppt', '.pptm', '.pptx']
export const EXCEL_FILE_TYPES = ['.csv', '.xls', '.xlsm']