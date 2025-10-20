import React from 'react';
import { SvgIcon } from "@mui/material";
import { useTheme } from '@mui/material/styles';

/* interfaces && Enum */
import { Locales } from "@/core/enum.js"
// import { type IconSvgProps } from "@/core/interfaces/index.js";

export type IconSvgProps = {
    icon?: string;
    className?: string;
    active?: boolean;
};


const LocalesSvg: React.FC<IconSvgProps> = (props) => {
    const { icon, active, ...other } = props;

    {/* TODO Please Delete other svg Locales */ }

    switch (icon) {
        case Locales.thai:
            return (
                <SvgIcon role="img" width="30" height="19" viewBox="0 0 30 19" {...other} >
                    <g clipPath="url(#clip0_706_32573)">
                        <rect width="30" height="19" rx="2" fill="white" />
                        <path d="M0 19H30V16H0V19Z" fill="#FF4B55" />
                        <path d="M30 0H0V3H30V0Z" fill="#FF4B55" />
                        <path d="M30 6H0V13H30V6Z" fill="#41479B" />
                        <path d="M30 3H0V6H30V3Z" fill="white" />
                        <path d="M0 16H30V13H0V16Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_706_32573">
                            <rect width="30" height="19" rx="2" fill="white" />
                        </clipPath>
                    </defs>
                </SvgIcon>
            );
        case Locales.eng:
            return (
                <SvgIcon role="img" width="30" height="19" viewBox="0 0 30 19" {...other}>
                    <g clipPath="url(#clip0_706_32574)">
                        <rect width="30" height="19" rx="2" fill="#41479B" />
                        <path d="M16.5 0H13.5V7V8H12.5H0V11H12.5H13.5V12V19H16.5V12V11H17.5H30V8H17.5H17H16.5V7V0Z" fill="#FF4B55" />
                        <path d="M13.5 0H12.5V5.98148V7H12.2778H9.66667H7.94118H0V8H12.5H13.5V7V0Z" fill="white" />
                        <path d="M17.5 0H16.5V7V8H17H17.5H30V7H22.0588H20.5H17.7162H17.5V5.98148V0Z" fill="white" />
                        <path d="M16.5 19H17.5V13.0185V12H17.7222H20.3333H22.0588H30V11H17.5H16.5V12V19Z" fill="white" />
                        <path d="M12.5 19H13.5V12V11H12.5H0V12H7.94118H10.0135H12.5V12.0526V13.0185V19Z" fill="white" />
                        <path d="M9.66667 7H12.2778L1 0H0V1L9.66667 7Z" fill="#FF4B55" />
                        <path d="M17.7162 7H20.5L30 1V0H28.5L17.7162 7Z" fill="#FF4B55" />
                        <path d="M20.3333 12H17.7222L29 19H30V18L20.3333 12Z" fill="#FF4B55" />
                        <path d="M12.5 12.0526V12H10.0135L0 18.5V19H1.5L12.5 12.0526Z" fill="#FF4B55" />
                        <path d="M12.5 7V5.98148L3 0H1L12.2778 7H12.5Z" fill="white" />
                        <path d="M0 2L7.94118 7H9.66667L0 1V2Z" fill="white" />
                        <path d="M17.5 5.98148V7H17.7162L28.5 0H27L17.5 5.98148Z" fill="white" />
                        <path d="M22.0588 7L30 2V1L20.5 7H22.0588Z" fill="white" />
                        <path d="M30 18V17L22.0588 12H20.3333L30 18Z" fill="white" />
                        <path d="M17.5 12V13.0185L27 19H29L17.7222 12H17.5Z" fill="white" />
                        <path d="M0 17V18.5L10.0135 12H7.94118L0 17Z" fill="white" />
                        <path d="M1.5 19H3L12.5 13.0185V12.0526L1.5 19Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_706_32574">
                            <rect width="30" height="19" rx="2" fill="white" />
                        </clipPath>
                    </defs>
                </SvgIcon>
            );
        default:
            break;
    }
};

export default LocalesSvg;