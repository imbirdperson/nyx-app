import {create} from "zustand";

interface LeftPanelState {
    leftPanelWidth: number;
    isDragging: boolean;
    setLeftPanelWidth: (width: number) => void;
    setIsDragging: (dragging: boolean) => void;
    toggleLeftPanel: () => void;
    
}

export const useLeftPanelStore = create<LeftPanelState>((set) => ({
    leftPanelWidth: 250, // Initial width
    isDragging: false,   // Initial dragging state
    setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),
    setIsDragging: (dragging) => set({ isDragging: dragging }),
    toggleLeftPanel: () =>
      set((state) => ({ leftPanelWidth: state.leftPanelWidth === 0 ? 250 : 0 })),
  }));