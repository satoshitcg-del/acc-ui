import { useState } from 'react';
import ProductManagementService from '@/services/ProductManagementService';
import { useTranslation } from 'react-i18next';
import { IConfirmWLReq } from '@/core/interface/services';

/* State management */
import { useRecoilState } from 'recoil';
import { TriggerTableProductManagement } from '../storerecoil';
import { useTranslateErrorCode } from './useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { ProductMasterType } from '@/core/enum';

export const useConfirm = (product_id: string, month: string, year: string, setIsTrigerComfirmbutton: any, product_type: string) => {
    const { t } = useTranslation();
    const { confirmWinLose, generatePdf, getAutoPlayWinlose } = ProductManagementService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    // const [req, setReq] = useState<string>(product_id);
    const [triggerTable, setTriggerTable] = useRecoilState(TriggerTableProductManagement);
    const [loadingWL, setLoadingWL] = useState<boolean | null>(false);
    const body: IConfirmWLReq = { product_id, month, year }

    const onSubmitConfirmWL = async () => {
        // console.log('body ====>', body);
        try {
            setIsTrigerComfirmbutton(true)
            setLoadingWL(true)
            const res = product_type === ProductMasterType.AUTO_PLAY ? await getAutoPlayWinlose(month.padStart(2, "0"), year) : await confirmWinLose(body);
            // if (res?.data?.update_at) {
            //     setTimeout(() => {
            //         setLoadingWL(false)
            //         setIsTrigerComfirmbutton(false)
            //         setTriggerTable(!triggerTable)
            //     }, 10000);
            // }
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
            setLoadingWL(false)
            setIsTrigerComfirmbutton(false)
            setTriggerTable(!triggerTable)
        } finally {
            setTimeout(() => {
                setLoadingWL(false)
                setIsTrigerComfirmbutton(false)
                setTriggerTable(!triggerTable)
            }, 10000);
        }
    }

    const onSubmitGeneratePdf = async () => {
        try {
            const res = await generatePdf(body);
            if (res?.data?.update_at) {
                alertSuccess(t('modal.save-success')).then(() => {
                    setTriggerTable(!triggerTable)
                });
            }

        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    }

    return { loadingWL, onSubmitConfirmWL, onSubmitGeneratePdf }
}