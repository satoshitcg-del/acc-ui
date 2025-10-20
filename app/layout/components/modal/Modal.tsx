
import React from 'react'
import {
    Paper,
    Modal,
    type ModalProps,
} from "@mui/material";

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40rem",
    // minWidth: "37.5rem",
    // maxWidth: "60dvw",
    height: "auto",
    // overFlow: "auto",
    p: "1.5rem"
};

const ModalCustom = (props: ModalProps) => {

    return (
        <>
            <Modal {...props} >
                <Paper sx={stylePaperModal}>
                    {props.children}
                </Paper>
            </Modal>
        </>
    )
}

export default ModalCustom
