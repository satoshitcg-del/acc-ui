import React, { useState } from 'react';
import { Modal, Box, IconButton, Button, Paper } from '@mui/material';
import { Close as CloseIcon, Add, Remove, ArrowBack, ArrowForward } from '@mui/icons-material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { truncate } from 'fs/promises';
import { Action } from '@/core/enum';


pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


interface ComponentProps {
    openModal: any;
    setOpenModal: any;
    pdfUrl: any;
}

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "53rem",
    // minWidth: "37.5rem",
    // maxWidth: "60dvw",
    // overflow: "auto",
    maxHeight: "100vh",
    p: "2rem"
};

const PdfViewerModal = (props: ComponentProps) => {
    const { openModal, setOpenModal, pdfUrl } = props;
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfScale, setPDFScale] = useState(1.3);
    console.log("pdfurl", pdfUrl)


    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber - 1));
    };

    const handleNextPage = () => {
        if (numPages) {
            setPageNumber((prevPageNumber) => Math.min(numPages, prevPageNumber + 1));
        }
    };

    const handleClosePDFViewerModal = () => {
        setOpenModal({ ...openModal, pdfViewerModal: false });
    };


    const handlechangeScalePDF = (action: Action) => {
        const newScale = action === Action.Add ? pdfScale + 0.1 : pdfScale - 0.1;
        setPDFScale(parseFloat(newScale.toFixed(1)));
    };

    return (
        <Modal open={openModal.pdfViewerModal} onClose={handleClosePDFViewerModal}>
            <Box>
                <Paper sx={stylePaperModal}>
                    <IconButton
                        onClick={handleClosePDFViewerModal}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            py: "0.5rem",
                            pr: "0.5rem"
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ maxHeight: "86vh", overflow: "auto" }}>
                        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber} scale={pdfScale} />
                        </Document>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} pb={1}>
                        <Box>
                            <p>
                                Page {pageNumber} of {numPages}
                            </p>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "col", justifyContent: "center" }}>
                            <IconButton
                                disabled={pageNumber <= 1}
                                color='primary'
                                onClick={handlePrevPage}
                            >
                                <ArrowBack />
                            </IconButton>
                            <IconButton
                                disabled={pageNumber >= (numPages ?? 0)}
                                color='primary'
                                onClick={handleNextPage}
                            >
                                <ArrowForward />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "col", justifyContent: "center" }}>
                            <IconButton
                                disabled={pdfScale == 1.5 ? true : false}
                                color='primary'
                                onClick={() =>
                                    handlechangeScalePDF(Action.Add)
                                }
                            >
                                <Add />
                            </IconButton>
                            <IconButton
                                disabled={pdfScale == 1.3 ? true : false}
                                color='primary'
                                onClick={() =>
                                    handlechangeScalePDF(Action.Remove)
                                }
                            >
                                <Remove />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>

            </Box >
        </Modal >
    );
};

export default PdfViewerModal;
