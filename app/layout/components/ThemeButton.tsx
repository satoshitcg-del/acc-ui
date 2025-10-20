


import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useToggleTheme } from "../../theme/index.js";

export function ThemeButton(props: ThemeButtonProps) {
  const { ...other } = props;
  const toggleTheme = useToggleTheme();
  const theme = useTheme();

  return (
    <IconButton onClick={toggleTheme} {...other}>
      {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}

export type ThemeButtonProps = Omit<IconButtonProps, "children">;
