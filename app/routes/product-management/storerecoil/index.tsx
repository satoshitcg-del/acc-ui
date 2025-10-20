import { atom } from "recoil";

export const TriggerTableProductManagement = atom<boolean>({
    key: "TriggerTableProductManagement",
    default: false,
});