import { create } from 'zustand';

interface SimulationState {
  density: number;
  setDensity: (val: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  density: 0,
  setDensity: (val) => set({ density: val }),
}));
