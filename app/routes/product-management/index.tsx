import { Box, Container } from "@mui/material";
import ProductTable from "./components/ProductManagementTable.js";

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
        <ProductTable />
      </Box>
    </>
  );
}
Component.displayName = "ProductList";
