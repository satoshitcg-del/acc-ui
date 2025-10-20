import LocalesSvg from "@/icons/LocalesSvg";
import { Box, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { getAuthToken, setAuthToken } from "@/core/utils/auth/auth.js";
import { TokenType, Locales } from "@/core/enum.js";
import { useTranslation } from "react-i18next";

import { TriggerLang } from "@/core/storerecoil"
import { useRecoilState } from "recoil";

interface ChildProps { }



const SwitchLanguage: React.FC<ChildProps> = ({ }) => {
    const { i18n } = useTranslation();
    const [triggerTriggerLang, setTriggerLang] = useRecoilState(TriggerLang);
    const [language, setLanguage] = React.useState<string>("");
    const handleChangeLang = (value: string) => {
        i18n.changeLanguage(value);
        setAuthToken(value, TokenType.Language);
        setLanguage(value);
        setTriggerLang(!triggerTriggerLang)
    };
    const languageManagement = () => {
        const myLanguage = getAuthToken(TokenType.Language);
        if (myLanguage) {
            handleChangeLang(myLanguage);
        } else {
            setAuthToken(Locales.thai, TokenType.Language);
            handleChangeLang(Locales.thai);
        }
    };

    useEffect(() => {
        languageManagement();
    }, []);

    return (
        <div className="flex">
            <Box className="flex items-center">
                {(() => {
                    switch (language) {
                        case Locales.thai:
                            return (
                                <IconButton
                                    data-testid="language-switchlanguage-eng-button"
                                    className=""
                                    onClick={() => handleChangeLang(Locales.eng)}
                                >
                                    <LocalesSvg icon={Locales.thai} />
                                </IconButton>
                            );
                        case Locales.eng:
                            return (
                                <IconButton
                                    data-testid="language-switchlanguage-thai-button"
                                    className=""
                                    onClick={() => handleChangeLang(Locales.thai)}
                                >
                                    <LocalesSvg icon={Locales.eng} />
                                </IconButton>
                            );
                    }
                })()}
            </Box>
        </div>
    );
};

export default SwitchLanguage;