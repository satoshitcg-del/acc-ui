import ModalCustom from "@/layout/components/modal/Modal.js";
import { Box, Button, Divider, Typography } from "@mui/material";
import { t } from "i18next";

interface ComponentProps {
    openModal: any;
    setOpenModal: any;
    prefixList: any;
}

export interface ISubProducts {
    subProductName: string;
    prefix?: string[];
    quantity?: number;
    detail?: string;
    discount?: string[];
    status: string
}

export default function Component(props: ComponentProps) {
    const { openModal, setOpenModal, prefixList } = props;
    const handleClosePrefixModal = () => {
        setOpenModal({ ...openModal, prefixModal: false });
    }

    return (
        <>
            <ModalCustom
                open={openModal.prefixModal}
                onClose={handleClosePrefixModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: "24px",
                                mb: 3,
                            }}
                        >
                            {t("title.prefix-info")}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            my: 1,
                            maxWidth: "35rem",
                            flexWrap: "wrap"
                        }}
                    >
                        {prefixList?.map((item: any, index: number) => (
                            <Typography
                                key={item.product_link_id}
                                sx={{
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    width: "50%",
                                    marginBottom: "1rem"
                                }}
                                align="center"
                            >
                                {index + 1}.   {item}
                            </Typography>
                        ))}
                    </Box>
                    <Divider sx={{ marginTop: "1.7rem" }} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                            paddingTop: "15px",
                        }}
                    >
                        <Button
                            data-testid="prefix-prefixmodal-close-button"
                            variant="text"
                            children={t('button.close')}
                            onClick={handleClosePrefixModal}
                        />
                    </Box>
                </>
            </ModalCustom>
        </>
    )

}
Component.displayName = "PrefixModal";