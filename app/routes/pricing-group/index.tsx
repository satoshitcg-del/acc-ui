import { Box } from "@mui/material";
import PricingGroupTable from "./components/PricingGroupTable";

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
        <PricingGroupTable />
      </Box>
    </>
  );
}
Component.displayName = "PricingGroupList";