import { atom } from "recoil";

export const TriggerLang = atom<boolean>({
    key: "TriggerLang",
    default: false,
});