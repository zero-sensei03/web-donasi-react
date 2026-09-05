import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setSidebar: (open: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set(() => ({ isOpen: false })),
  openSidebar: () => set(() => ({ isOpen: true })),
  setSidebar: (open) => set({ isOpen: open }),
}));
