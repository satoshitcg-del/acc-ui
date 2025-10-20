


import { Api } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { usePageEffect } from "../../core/page.js";

export function Component() {
  usePageEffect({ title: "Accounting" });

  return (
    <Container sx={{ py: "6vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Welcome to React Starter Kit!
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        The web&apos;s most popular Jamstack React template.
      </Typography>

      <Typography sx={{ mb: 4, textDecoration: "underline" }} variant="h1" color="skyblue" fontWeight="bold" align="center">
        This is Material UI Component
      </Typography>

      <h1 className="text-center text-3xl font-bold text-sky-300 underline">
        This is Tailwind Component
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          href={`/api`}
          children="Explorer API"
          startIcon={<Api />}
        />
      </Box>
    </Container>
  );
}

Component.displayName = "Dashboard";
