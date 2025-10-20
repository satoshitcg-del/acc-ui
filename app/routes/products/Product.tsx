import { Box, Container } from "@mui/material";
import ProductTable from "./components/ProductTable.js";

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
        <ProductTable></ProductTable>
      </Box>
    </>
  );
}
Component.displayName = "ProductList";
