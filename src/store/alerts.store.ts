import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AlertRule {
  id: string;
  metricId: string;
  metricName: string;
  condition: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  threshold: number;
  enabled: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message?: string;
  soundEnabled?: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  metricId: string;
  metricName: string;
  value: number;
  threshold: number;
  severity: AlertRule['severity'];
  timestamp: number;
  acknowledged: boolean;
  message?: string;
}

export interface AlertsState {
  rules: AlertRule[];
  activeAlerts: Alert[];
  acknowledgedAlerts: Alert[];
  soundEnabled: boolean;
  
  // Actions
  addRule: (rule: Omit<AlertRule, 'id'>) => void;
  updateRule: (id: string, updates: Partial<AlertRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlert: (id: string) => void;
  clearAllAlerts: () => void;
  
  toggleSound: () => void;
  checkMetric: (metricId: string, value: number, metricName: string) => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      rules: [],
      activeAlerts: [],
      acknowledgedAlerts: [],
      soundEnabled: true,

      addRule: (ruleData) => {
        const rule: AlertRule = {
          ...ruleData,
          id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          rules: [...state.rules, rule],
        }));
      },

      updateRule: (id, updates) => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id ? { ...rule, ...updates } : rule
          ),
        }));
      },

      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((rule) => rule.id !== id),
          activeAlerts: state.activeAlerts.filter((alert) => alert.ruleId !== id),
        }));
      },

      toggleRule: (id) => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
          ),
        }));
      },

      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        
        set((state) => {
          // Check if alert already exists for this rule
          const existingAlert = state.activeAlerts.find(
            (a) => a.ruleId === alert.ruleId && !a.acknowledged
          );
          
          if (existingAlert) {
            // Update existing alert
            return {
              activeAlerts: state.activeAlerts.map((a) =>
                a.id === existingAlert.id ? alert : a
              ),
            };
          }
          
          // Play sound if enabled
          if (get().soundEnabled && alertData.soundEnabled !== false) {
            playAlertSound(alert.severity);
          }
          
          return {
            activeAlerts: [...state.activeAlerts, alert],
          };
        });
      },

      acknowledgeAlert: (id) => {
        set((state) => {
          const alert = state.activeAlerts.find((a) => a.id === id);
          if (!alert) return state;
          
          return {
            activeAlerts: state.activeAlerts.filter((a) => a.id !== id),
            acknowledgedAlerts: [...state.acknowledgedAlerts, { ...alert, acknowledged: true }],
          };
        });
      },

      clearAlert: (id) => {
        set((state) => ({
          activeAlerts: state.activeAlerts.filter((a) => a.id !== id),
        }));
      },

      clearAllAlerts: () => {
        set((state) => ({
          acknowledgedAlerts: [...state.acknowledgedAlerts, ...state.activeAlerts],
          activeAlerts: [],
        }));
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      checkMetric: (metricId, value, metricName) => {
        const { rules } = get();
        const activeRules = rules.filter(
          (rule) => rule.enabled && rule.metricId === metricId
        );

        activeRules.forEach((rule) => {
          let triggered = false;

          switch (rule.condition) {
            case 'gt':
              triggered = value > rule.threshold;
              break;
            case 'lt':
              triggered = value < rule.threshold;
              break;
            case 'gte':
              triggered = value >= rule.threshold;
              break;
            case 'lte':
              triggered = value <= rule.threshold;
              break;
            case 'eq':
              triggered = Math.abs(value - rule.threshold) < 0.01;
              break;
          }

          if (triggered) {
            get().addAlert({
              ruleId: rule.id,
              metricId,
              metricName,
              value,
              threshold: rule.threshold,
              severity: rule.severity,
              message: rule.message || `${metricName} ${rule.condition} ${rule.threshold}`,
              soundEnabled: rule.soundEnabled !== false,
            });
          }
        });
      },
    }),
    {
      name: 'alerts-storage',
      partialize: (state) => ({
        rules: state.rules,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);

// Sound player utility
function playAlertSound(severity: AlertRule['severity']): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different severities
    const frequencies: Record<AlertRule['severity'], number> = {
      info: 440,
      warning: 550,
      error: 660,
      critical: 880,
    };

    oscillator.frequency.value = frequencies[severity];
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.warn('Could not play alert sound:', error);
  }
}
