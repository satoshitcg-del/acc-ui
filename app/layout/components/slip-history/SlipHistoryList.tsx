import React from "react";
import { Box, Typography, Paper, Checkbox, Button } from "@mui/material";
import { t } from "i18next";
import { Image } from '@mui/icons-material';
import { dateFormated, formatDateLanguage } from "@/core/utils";
import { MAX_FILES } from "@/core/utils/fileValidation";

const SlipHistoryList: React.FC<any> = ({ index, slips, handleOpenCarouselModal, handleOpenDeleteSlip, selectedSlips, handleSelectSlip }) => {

    const handleCheckSlipDeletable = () => {
        if (slips?.slips_data?.length > 0) {
            return slips.slips_data.some((slip: any) => slip.deletable);
        }
        return false;
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "bold", alignItems: 'center' }}>
                    {t("modal.slip")} {formatDateLanguage(slips?.date)} {`(${slips?.slips_data.length}/${MAX_FILES})`}
                </Typography>
                {handleCheckSlipDeletable() &&
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenDeleteSlip()}
                        color="error"
                        disabled={selectedSlips.length == 0}
                    >
                        {t('button.delete')}
                    </Button>
                }
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                {slips?.slips_data?.map((slip: any, index: number) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            width: "calc(50% - 6px)",
                            // minWidth: "160px",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                borderColor: "#888",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                transform: "translateY(-2px)",
                            },
                            "&:active": {
                                transform: "scale(0.98)",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                            },
                        }}
                        onClick={() => handleOpenCarouselModal(slips?.slips_data, index)}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "4px",
                            }}
                        >
                            <Image
                                color="primary"
                                sx={{
                                    fontSize: 42,
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <Typography
                                data-testid="slip-history-slip-text"
                                sx={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    width: "100%",
                                    maxHeight: "50px",
                                    paddingRight: "30px",
                                }}
                            >
                                {slip.file_name_preview}
                            </Typography>
                            <Typography
                                data-testid="slip-history-slip-text"
                                sx={{
                                    textAlign: "right",
                                    fontSize: "0.75rem",
                                    color: "text.secondary",
                                    pr: "5px",
                                }}
                            >
                                {dateFormated(slip.update_at)}
                            </Typography>
                        </Box>
                        {slip?.deletable &&
                            <Checkbox
                                checked={selectedSlips.some((s: any) => s.file_name === slip.file_name)}
                                sx={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "0px",
                                    zIndex: 1,
                                    width: 32,
                                    height: 32,
                                }}
                                disableRipple
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectSlip(slip);
                                }}
                            />
                        }
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default SlipHistoryList;
