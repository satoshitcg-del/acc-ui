import React, { useState } from "react";
import Loading from "@/layout/components/loading/Loading";
import ModalCustom from "@/layout/components/modal/Modal";
import { Backdrop, Box, Button, Typography, Paper } from "@mui/material";
import { t } from "i18next";
import "./styles.css";
import parse from "html-react-parser";

interface CustomerProfileProps {
  openModal: any;
  setOpenModal: React.Dispatch<any>;
  customerProfile: any;
}

interface Column {
  id: string;
  label: string;
}

const columns: readonly Column[] = [
  { id: "username", label: t("placeholder.username") },
  { id: "full_name", label: t("placeholder.fullname") },
  { id: "email", label: t("placeholder.email") },
  { id: "password", label: t("placeholder.password") },
  { id: "phone_number", label: t("placeholder.phone-number") },
  { id: "line_id", label: t("placeholder.line-id") },
  { id: "telegram", label: t("placeholder.telegram") },
  { id: "what_app", label: t("placeholder.whats-app") },
  { id: "note", label: t("placeholder.note") },
];

const CustomerProfileModal: React.FC<CustomerProfileProps> = ({
  openModal,
  setOpenModal,
  customerProfile,
}: CustomerProfileProps) => {
  const [backDrop, setBackDrop] = useState(false);

  const handleCloseCustomerProfileModal = () => {
    setOpenModal({ ...openModal, customerProfileModal: false });
  };

  const renderColumnLabel = (column: Column) =>
    column.id !== "note" && (
      <Typography
        key={column.id}
        className="font-semibold"
        variant="body1"
        sx={{ fontWeight: "500" }}
      >
        {column.label}
      </Typography>
    );

  const renderColumnValue = (column: Column, index: number) =>
    column.id !== "note" && (
      <Typography
        key={`${customerProfile[column.id]}-${index}`}
        variant="body1"
        sx={{ fontWeight: "500" }}
      >
        {customerProfile[column.id] || "-"}
      </Typography>
    );

  return (
    <ModalCustom
      className={`scrollbar`}
      open={openModal.customerProfileModal}
      onClose={handleCloseCustomerProfileModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDrop}
        >
          <Loading />
        </Backdrop>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "1rem",
            gap: "1.5rem",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "modal.title_color", fontWeight: "500" }}
          >
            {t("title.customer")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              py: "0.5rem",
              overflow: "auto",
              maxHeight: "40dvh",
              paddingRight: "0.5rem",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "45%",
                  }}
                >
                  {columns.map(renderColumnLabel)}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "55%",
                  }}
                >
                  {columns.map(renderColumnValue)}
                </Box>
              </Box>
              <Box sx={{ py: "0.5rem" }}>
                {customerProfile.note !== "" && (
                  <Paper className="w-full mt-5 rounded-md" variant="outlined">
                    <Box>
                      <Typography
                        className="font-semibold"
                        variant="body1"
                        sx={{ fontWeight: "500", paddingLeft: "1rem" }}
                      >
                        {t("placeholder.note")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Box sx={{ paddingLeft: "2rem" }}>
                        {parse(customerProfile.note)}
                      </Box>
                    </Box>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              data-testid="customer-addproductcustomer-close-button"
              variant="text"
              children={t("button.close")}
              onClick={handleCloseCustomerProfileModal}
            />
          </Box>
        </Box>
      </>
    </ModalCustom>
  );
};

export default CustomerProfileModal;
