import { useState } from 'react';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAlertsStore, AlertRule } from '@/store/alerts.store';
import { useMetricsStore } from '@/store/metrics.store';
import { Card } from '@/components/ui/Card';
import clsx from 'clsx';

export function AlertRulesManager() {
  const { rules, addRule, deleteRule, updateRule, toggleRule } = useAlertsStore();
  const { getAllLatestMetrics } = useMetricsStore();
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [showForm, setShowForm] = useState(false);

  const availableMetrics = getAllLatestMetrics();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const ruleData = {
      metricId: formData.get('metricId') as string,
      metricName: formData.get('metricName') as string,
      condition: formData.get('condition') as AlertRule['condition'],
      threshold: parseFloat(formData.get('threshold') as string),
      enabled: editingRule ? editingRule.enabled : true,
      severity: formData.get('severity') as AlertRule['severity'],
      message: (formData.get('message') as string) || undefined,
      soundEnabled: formData.get('soundEnabled') === 'on',
    };

    if (editingRule) {
      updateRule(editingRule.id, ruleData);
      setEditingRule(null);
    } else {
      addRule(ruleData);
    }
    
    setShowForm(false);
    (e.target as HTMLFormElement).reset();
  };

  const startEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const getSeverityColor = (severity: AlertRule['severity']) => {
    const colors = {
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      critical: 'bg-purple-500',
    };
    return colors[severity];
  };

  return (
    <Card title="Reglas de Alertas">
      <div className="space-y-4">
        <button
          onClick={() => {
            setEditingRule(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Regla
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Métrica</label>
              <select
                name="metricId"
                required
                defaultValue={editingRule?.metricId}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="">Seleccionar métrica...</option>
                {availableMetrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <input type="hidden" name="metricName" value={editingRule?.metricName || ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Condición</label>
                <select
                  name="condition"
                  required
                  defaultValue={editingRule?.condition}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="gt">&gt; Mayor que</option>
                  <option value="lt">&lt; Menor que</option>
                  <option value="gte">≥ Mayor o igual</option>
                  <option value="lte">≤ Menor o igual</option>
                  <option value="eq">= Igual a</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Umbral</label>
                <input
                  type="number"
                  name="threshold"
                  required
                  step="0.01"
                  defaultValue={editingRule?.threshold}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severidad</label>
              <select
                name="severity"
                required
                defaultValue={editingRule?.severity || 'warning'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
              <input
                type="text"
                name="message"
                defaultValue={editingRule?.message}
                placeholder="Mensaje personalizado..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="soundEnabled"
                defaultChecked={editingRule?.soundEnabled !== false}
                className="rounded"
              />
              <label className="text-sm">Activar sonido</label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                {editingRule ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRule(null);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {rules.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No hay reglas configuradas
            </p>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{rule.metricName}</span>
                      <span
                        className={clsx(
                          'px-2 py-0.5 rounded text-xs text-white',
                          getSeverityColor(rule.severity)
                        )}
                      >
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rule.metricName} {getConditionSymbol(rule.condition)} {rule.threshold}
                    </p>
                    {rule.message && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {rule.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="p-1"
                      title={rule.enabled ? 'Desactivar' : 'Activar'}
                    >
                      {rule.enabled ? (
                        <ToggleRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(rule)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-primary-500"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1 text-red-600 dark:text-red-400 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function getConditionSymbol(condition: AlertRule['condition']): string {
  const symbols = {
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
    eq: '=',
  };
  return symbols[condition];
}
