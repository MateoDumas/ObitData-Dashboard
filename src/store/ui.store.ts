import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  selectedTimeRange: '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTimeRange: (range: UIState['selectedTimeRange']) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      selectedTimeRange: '1h',

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setTimeRange: (range) => {
        set({ selectedTimeRange: range });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme, selectedTimeRange: state.selectedTimeRange }),
    }
  )
);
