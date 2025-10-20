import { create } from "zustand";
import { ICustomer } from "../interface/services";

interface ProfileStore {
    profile: ICustomer | null;
    setProfile: (profile: ICustomer) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
}));
