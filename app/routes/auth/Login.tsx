import React from 'react'
import { Box } from '@mui/material';
import LoginForm from './components/LoginForm';
import { AuthenticationPage } from '@/core/enum';
import bgLogin from "../../assets/login/login-bg.svg";
import { SettingPassword } from './components/SettingPassword';
import { SetUpAuthentication } from './components/SetUpAuthentication';
import { TwoStepAuthentication } from './components/TwoStepAuthentication';
import SwitchLanguage from './components/SwitchLanguage';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box sx={{ position: 'reletive', bgcolor: 'white', overflow: 'hidden' }}>
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <SwitchLanguage />
        </Box>

        <Box
            sx={{
                flex: 1,
                zIndex: 10,
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                position: 'absolute',
            }}
        >
            {children}
        </Box>

        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 0 }}>
            <img
                src={bgLogin}
                alt="background"
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                }}
            />
        </Box>
    </Box>
);

export default function Component() {
    const [pageName, setPageName] = React.useState<keyof typeof pageComponents>(AuthenticationPage.LoginForm);

    const pageComponents = {
        [AuthenticationPage.LoginForm]: <LoginForm callback={setPageName} />,
        [AuthenticationPage.SetPasswordForm]: <SettingPassword callback={setPageName} />,
        [AuthenticationPage.SetTwoFactorForm]: <SetUpAuthentication callback={setPageName} />,
        [AuthenticationPage.InputTwoFactorForm]: <TwoStepAuthentication callback={setPageName} />,
    };

    return (
        <AuthLayout>
            {pageComponents[pageName] || <div>Page not found</div>}
        </AuthLayout>
    );
}

Component.displayName = "Login";


