import {
    Box,
    Button,
    Modal,
    Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import SlickCarousel from './SlickCarousel';
import { t } from 'i18next';

interface ComponentProps {
    openModal: boolean;
    setOpenCarouselSlips: Dispatch<SetStateAction<boolean>>
    slips?: any
    isDelete?: boolean;
    setIsDelete?: any;
    handleOpenConfirmTwoFactorModal?: any;
    index?: number;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
};

export default function Component(props: ComponentProps) {
    const {
        openModal,
        setOpenCarouselSlips,
        slips,
        isDelete,
        setIsDelete,
        handleOpenConfirmTwoFactorModal,
        index,
    } = props;

    const handleCloseModal = async () => {
        setOpenCarouselSlips(false);
        setIsDelete(false);
    }
    const [currentIndex, setCurrentIndex] = useState(index)

    return (
        <>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        width: 640,
                        height: 550,
                        overflowY: "auto",
                    }}>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>
                        {`${isDelete ? t("modal.confirm-delete-slip") : t("modal.slip")} (${(currentIndex || 0) + 1}/${slips?.length}) - ${slips[(currentIndex || 0)]?.name}`}
                    </Typography>
                    <Box>
                        <SlickCarousel slips={slips} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "4px", gap: 1 }}>
                        {isDelete ? (
                            <>
                                <Button
                                    data-testid="cancel-button"
                                    variant="contained"
                                    color="error"
                                    children={t("button.cancel")}
                                    onClick={() => handleCloseModal()}
                                />
                                <Button
                                    type="submit"
                                    data-testid="confirm-button"
                                    variant="contained"
                                    color="success"
                                    children={t("button.confirm")}
                                    onClick={() => handleOpenConfirmTwoFactorModal()}
                                />
                            </>
                        ) : (
                            <Button data-testid="slip-history-cancel-button" onClick={handleCloseModal} children={t('billing.close')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                        )}
                    </Box>
                </Box>

            </Modal>
        </>
    );
}

Component.displayName = 'CarouselSlipsModal';
