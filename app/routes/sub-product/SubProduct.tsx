import { Container } from "@mui/material";
import SubProductTable from "./components/SubProductTable.js";
import { useLocation } from "react-router-dom";
import React from "react";

export default function Component() {
  const { state } = useLocation();
  return (
    <>
      <SubProductTable></SubProductTable>
    </>
  );
}
Component.displayName = "SubProductList";
