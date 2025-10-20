// utils/useAlertDialog.ts
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { sweetalert } from '@/core/enum';

export const useAlertDialog = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const alertError = (titleKey: string, textKey?: string, htmlKey?: string) => {
        return Swal.fire({
            icon: 'error',
            title: titleKey,
            text: textKey ? textKey : undefined,
            showConfirmButton: true,
            confirmButtonText: t('button.ok'),
            background: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            html: htmlKey ? htmlKey : undefined,
        });
    };

    const alertSuccess = (titleKey: string, textKey?: string, htmlKey?: string) => {
        return Swal.fire({
            icon: 'success',
            title: titleKey,
            text: textKey ? textKey : undefined,
            showConfirmButton: false,
            timer: sweetalert.successTimer,
            background: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            html: htmlKey ? htmlKey : undefined,
        });
    };

    const alertWarning = (titleKey: string, textKey?: string, htmlKey?: string) => {
        return Swal.fire({
            icon: 'warning',
            title: titleKey,
            text: textKey ? textKey : undefined,
            showConfirmButton: true,
            confirmButtonText: t('button.ok'),
            background: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            html: htmlKey ? htmlKey : undefined,
        });
    };
    return {
        alertError,
        alertSuccess,
        alertWarning,
    };
};
