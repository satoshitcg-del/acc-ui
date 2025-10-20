import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouteError } from "react-router-dom";
import TwoFactorLottie from "@/icons/TwoFactorLottie";
import { ErrorPage } from "@/assets/svg/ErrorPage"

export function RootError() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const err = useRouteError() as RouteError;
  const error = { status: err.status || 500, message: err.statusText ?? err.message }
  console.log("useRouteError:", error);

  return (
    <Container className="w-full h-[100vh] flex items-center " sx={{}} maxWidth="sm">
      <Box className="w-full flex flex-col justify-center gap-5 mb-[5rem]">
        <Box className="w-full flex justify-center">
          <ErrorPage className="h-[18rem]" />
        </Box>

        <Typography
          variant="h4"
          align="center"
        >
          {/* <strong>Error {err.status || 500}</strong>:{" "}
        {err.statusText ?? err.message} */}
          <strong>{t('error.page')}</strong>
        </Typography>
        <Button variant="contained" className="mt-3 mx-auto max-w-xs" onClick={() => navigate('/')}>
          <Typography variant="body1">
            {t('error.button')}
          </Typography>
        </Button>
      </Box>
    </Container>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
