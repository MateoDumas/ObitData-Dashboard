import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'stats';
  metricIds: string[];
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export interface SavedDashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: number;
  updatedAt: number;
}

export interface DashboardsState {
  dashboards: SavedDashboard[];
  currentDashboardId: string | null;
  
  createDashboard: (name: string) => string;
  updateDashboard: (id: string, updates: Partial<SavedDashboard>) => void;
  deleteDashboard: (id: string) => void;
  getDashboard: (id: string) => SavedDashboard | undefined;
  setCurrentDashboard: (id: string | null) => void;
  
  addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => void;
  deleteWidget: (dashboardId: string, widgetId: string) => void;
}

export const useDashboardsStore = create<DashboardsState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      currentDashboardId: null,

      createDashboard: (name) => {
        const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const dashboard: SavedDashboard = {
          id,
          name,
          widgets: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          dashboards: [...state.dashboards, dashboard],
          currentDashboardId: id,
        }));
        return id;
      },

      updateDashboard: (id, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((dashboard) =>
            dashboard.id === id
              ? { ...dashboard, ...updates, updatedAt: Date.now() }
              : dashboard
          ),
        }));
      },

      deleteDashboard: (id) => {
        set((state) => ({
          dashboards: state.dashboards.filter((dashboard) => dashboard.id !== id),
          currentDashboardId:
            state.currentDashboardId === id ? null : state.currentDashboardId,
        }));
      },

      getDashboard: (id) => {
        return get().dashboards.find((dashboard) => dashboard.id === id);
      },

      setCurrentDashboard: (id) => {
        set({ currentDashboardId: id });
      },

      addWidget: (dashboardId, widgetData) => {
        const widget: DashboardWidget = {
          ...widgetData,
          id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          dashboards: state.dashboards.map((dashboard) =>
            dashboard.id === dashboardId
              ? { ...dashboard, widgets: [...dashboard.widgets, widget], updatedAt: Date.now() }
              : dashboard
          ),
        }));
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((dashboard) =>
            dashboard.id === dashboardId
              ? {
                  ...dashboard,
                  widgets: dashboard.widgets.map((widget) =>
                    widget.id === widgetId ? { ...widget, ...updates } : widget
                  ),
                  updatedAt: Date.now(),
                }
              : dashboard
          ),
        }));
      },

      deleteWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map((dashboard) =>
            dashboard.id === dashboardId
              ? {
                  ...dashboard,
                  widgets: dashboard.widgets.filter((widget) => widget.id !== widgetId),
                  updatedAt: Date.now(),
                }
              : dashboard
          ),
        }));
      },
    }),
    {
      name: 'dashboards-storage',
    }
  )
);
