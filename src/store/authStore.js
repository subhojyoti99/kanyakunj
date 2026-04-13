import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "kanyakunj-auth",
      onRehydrateStorage: () => (state) => {
        // Called immediately once localStorage has been read
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
