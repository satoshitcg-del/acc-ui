import React from "react";
import { Box, Container } from "@mui/material";
import DiscountTable from "./DiscountTable.js";

export default function Component() {
  return (
    <>
      <Box
        className="h-full"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <DiscountTable />
      </Box>
    </>
  );
}
Component.displayName = "DiscountList";
