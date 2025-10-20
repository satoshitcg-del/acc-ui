import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

import English from "@/assets/locale/en/translation.json";
import Thailand from "@/assets/locale/th/translation.json";

const resources = {
    en: {
        translation: English,
    },
    th: {
        translation: Thailand,
    },
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: Cookies.get("LANGUAGE") || "th",
    });

export default i18next;