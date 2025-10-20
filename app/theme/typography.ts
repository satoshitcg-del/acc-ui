


import { TypographyVariantsOptions } from "@mui/material/styles";

export const options: TypographyVariantsOptions = {
  fontFamily: [
    // `-apple-system`,
    // `"BlinkMacSystemFont"`,
    // `"Segoe UI"`,
    `"tiamut-regular-webfont"`,
    `"IBM Plex Sans Thai"`,
    `"Roboto"`,
    // `"Oxygen"`,
    // `"Ubuntu"`,
    // `"Cantarell"`,
    // `"Fira Sans"`,
    // `"Droid Sans"`,
    // `"Helvetica Neue"`,
    // `sans-serif`,
    // `"Poppins"`,
  ].join(","),
};

export const overrides: TypographyVariantsOptions = {
  h1: { fontSize: "6rem" },
  h2: { fontSize: "3.7rem" },
  h3: { fontSize: "3rem" },
  h4: { fontSize: "2.1rem", fontWeight: "400" },
  h5: { fontSize: "1.5rem" },
  h6: { fontSize: "1.2rem" },
  subtitle1: { fontSize: "1rem" },
  body2: { fontSize: "0.8rem" },
  caption: { fontSize: "0.75rem" },
  button: { textTransform: "none" },
};
