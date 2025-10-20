import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./styles.css";
import { t } from "i18next";

function SwitchComponent(prop: any) {
  const { status, showModalConfirmStatus, id } = prop;

  const handleStatusChange = (actionStatus: boolean) => {
    showModalConfirmStatus(actionStatus, id);
  };

  return (
    <Box className={`flex flex-row justify-center`}>
      <Box className={`${status ? "mask-box-active" : "mask-box-inactive"}`}>
        <Box
          className={`${status ? "active" : "inactive"}`}
          style={{
            transform: `translateX(${status === false ? 0 : "58px"})`,
          }}
        />
        <Box className={`flex flex-row`}>
          <Button
            data-testid="global-switchtable-statusinactive-button"
            disableRipple
            variant="text"
            sx={{ color: status === false ? "#ffffff" : "#2E7D32" }}
            onClick={() => handleStatusChange(!status)}
          >
            {t("table.inactive-toggle")}
          </Button>
          <Button
            data-testid="global-switchtable-statusactive-button"
            disableRipple
            variant="text"
            sx={{ color: status === true ? "#ffffff" : "#D32F2F" }}
            onClick={() => handleStatusChange(!status)}
          >
            {t("table.active-toggle")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
export default SwitchComponent;
