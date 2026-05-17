import { create } from "zustand";

type DashboardRange = "30d" | "90d" | "1y";

type DashboardStore = {
  range: DashboardRange;
  setRange: (range: DashboardRange) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  range: "90d",
  setRange: (range) => set({ range }),
}));
