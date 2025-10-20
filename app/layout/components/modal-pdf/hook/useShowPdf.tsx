import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
// service
import BillingService from "@/services/BillingService";
import CustomerService from "@/services/CustomerService";
import { t } from "i18next";

import { useState } from "react";
import { useAlertDialog } from "../../alert-dialog/useAlertDialog";

export const useShowPdf = () => {
    const { getCustomerPdf } = CustomerService();
    const { preview } = BillingService();
    const [pdfUrl, setPDFUrl] = useState<any>()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [openModalPdf, setOpenModalPdf] = useState<boolean>(false);
    const [openActionModal, setOpenActionModal] = useState<boolean>(false);
    const { alertError } = useAlertDialog();

    const handleOpenPDFPreviewModal = async (invoice_id: string) => {
        try {
            setOpenActionModal(true);
            const response = await preview(invoice_id);

            const pdfContent = response.config.url;

            setPDFUrl(new Blob([response.data]));
            setOpenModalPdf(true);
        } catch (error: any) {
            console.error('Error fetching or processing PDF:', error);
            alertError(TranslateErrorCode(error.code));
            // Handle the error as needed
        } finally {
            setOpenActionModal(false);
        }
    }

    const handleOpenPDFPreviewCustomerModal = async (id_customer: string) => {

        try {
            const response = await getCustomerPdf(id_customer);

            const pdfContent = response.config.url;

            setPDFUrl(new Blob([response.data]));
            setOpenModalPdf(true);
        } catch (error: any) {
            console.error('Error fetching or processing PDF:', error);
            alertError(TranslateErrorCode(error.code));
        }
    }

    const ClosePDFPreviewModal = () => {
        setOpenModalPdf(false);
    }

    return {
        pdfUrl,
        setPDFUrl,
        openModalPdf,
        setOpenModalPdf,
        handleOpenPDFPreviewModal,
        handleOpenPDFPreviewCustomerModal,
        ClosePDFPreviewModal,
        openActionModal,
        setOpenActionModal
    };
};
