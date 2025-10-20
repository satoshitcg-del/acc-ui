


import { Typography, TypographyProps } from "@mui/material";
import { config } from "../../core/config.js";

export function Logo(props: TypographyProps) {
  const { sx, ...other } = props;

  return (
    <Typography
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: 500,
      }}
      variant="h1"
      {...other}
    >
      Accounting
      {/* {config.app.name} */}
    </Typography>
  );
}
