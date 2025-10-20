import { DOCUMENT_FILE_TYPES, EXCEL_FILE_TYPES, IMAGES_FILE_TYPES, PRESENTATION_FILE_TYPES } from '@/core/utils/fileValidation';
import {
    Description,
    Image,
    PictureAsPdf,
    InsertDriveFile,
    TableChart,
    Slideshow,
} from '@mui/icons-material';

export const getFileIcon = (fileType: string) => {
    if (IMAGES_FILE_TYPES.some(ext => fileType?.includes(ext))) {
        return <Image color="primary" />;
    }
    if (fileType?.includes('pdf')) {
        return <PictureAsPdf color="error" />;
    }
    if (fileType?.includes('spreadsheet') || (EXCEL_FILE_TYPES.some(ext => fileType?.includes(ext)))) {
        return <TableChart color="success" />;
    }
    if (fileType?.includes('presentation') || fileType?.includes('powerpoint') || (PRESENTATION_FILE_TYPES.some(ext => fileType?.includes(ext)))) {
        return <Slideshow color="warning" />;
    }
    if (fileType?.includes('word') || fileType?.includes('document') || (DOCUMENT_FILE_TYPES.some(ext => fileType?.includes(ext)))) {
        return <Description color="info" />;
    }
    return <InsertDriveFile color="action" />;
};
