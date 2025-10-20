import { atom } from "recoil";

export const TriggerTableDiscount = atom<string | Date>({
    key: "TriggerTableDiscount",
    default: "",
});