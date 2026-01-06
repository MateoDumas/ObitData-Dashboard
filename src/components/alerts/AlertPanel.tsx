import { X, Bell, BellOff, CheckCircle } from 'lucide-react';
import { useAlertsStore, Alert } from '@/store/alerts.store';
import { formatTimestamp } from '@/utils/dataParser';
import clsx from 'clsx';

export function AlertPanel() {
  const { activeAlerts, acknowledgeAlert, clearAlert, clearAllAlerts, soundEnabled, toggleSound } =
    useAlertsStore();

  const getSeverityColor = (severity: Alert['severity']) => {
    const colors = {
      info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
      warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
      error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
      critical: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    };
    return colors[severity];
  };

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Alertas ({activeAlerts.length})
          </span>
          <button
            onClick={toggleSound}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title={soundEnabled ? 'Desactivar sonidos' : 'Activar sonidos'}
          >
            {soundEnabled ? (
              <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        {activeAlerts.length > 1 && (
          <button
            onClick={clearAllAlerts}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Limpiar todas
          </button>
        )}
      </div>

      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={clsx(
            'p-4 rounded-lg border shadow-lg animate-in slide-in-from-right',
            getSeverityColor(alert.severity)
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{alert.metricName}</span>
                <span className="text-xs opacity-75">
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm mb-2">{alert.message || 'Alerta activada'}</p>
              <div className="text-xs opacity-75 space-y-1">
                <div>
                  Valor: <span className="font-mono">{alert.value.toFixed(2)}</span>
                  {alert.threshold && (
                    <>
                      {' '}/ Umbral: <span className="font-mono">{alert.threshold}</span>
                    </>
                  )}
                </div>
                <div>{formatTimestamp(alert.timestamp)}</div>
              </div>
            </div>
            <button
              onClick={() => acknowledgeAlert(alert.id)}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
              title="Marcar como leída"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
