# 🎯 Guía de Funcionalidades

## 📋 Índice de Funcionalidades

### ✅ Implementadas

1. **Sistema de Alertas y Umbrales** ✅
   - Reglas configurables (>, <, >=, <=, =)
   - Notificaciones visuales en tiempo real
   - Sonidos de alerta por severidad
   - Panel de alertas flotante
   - Gestión de reglas en Settings

2. **Exportación de Datos** ✅
   - Exportar métricas a CSV
   - Exportar métricas a JSON
   - Exportar gráficos como PNG
   - Exportar gráficos como SVG
   - Exportar datos de gráficos estructurados

3. **Zoom y Pan en Gráficos** ✅
   - Zoom con rueda del mouse
   - Pan arrastrando
   - Botón de reset
   - Componente `LineChartWithZoom`

4. **Selector y Búsqueda de Métricas** ✅
   - Búsqueda por nombre, ID o categoría
   - Selección múltiple
   - Filtrado en tiempo real
   - Componente `MetricSelector`

5. **Comparación de Períodos** ✅
   - Comparar dos rangos temporales
   - Visualización lado a lado
   - Componente `ComparisonChart`

6. **Exportar Gráficos** ✅
   - PNG con fondo personalizable
   - SVG vectorial
   - Integrado en botón de exportación

7. **Replay de Datos** ✅
   - Reproducción de datos históricos
   - Control de velocidad
   - Barra de progreso
   - Loop opcional
   - Hook `useReplay`

8. **Sistema de Anotaciones** ✅
   - Marcar eventos en el tiempo
   - Store persistente
   - Filtrado por rango temporal

9. **Widgets Personalizables** ✅
   - Store para múltiples dashboards
   - Configuración de widgets
   - Posicionamiento (preparado para drag & drop)

10. **Modo Fullscreen** ✅
    - Hook `useFullscreen`
    - Soporte cross-browser
    - Para presentaciones

11. **Gráficos 3D** ✅
    - Componente `ThreeChart`
    - Visualizaciones 3D con Three.js
    - Requiere `three` package

12. **Predicciones y Tendencias** ✅
    - Regresión lineal
    - Promedios móviles
    - Suavizado exponencial
    - Cálculo de confianza

13. **Múltiples Dashboards** ✅
    - Crear y guardar dashboards
    - Gestión de widgets
    - Store persistente

14. **Sonidos de Alerta** ✅
    - Integrado en sistema de alertas
    - Diferentes tonos por severidad
    - Activar/desactivar

15. **Integración Webhooks** ✅
    - Utilidades para envío
    - Payloads predefinidos
    - Configuración flexible

## 🚀 Cómo Usar

### Alertas

1. Ve a **Settings** → **Reglas de Alertas**
2. Click en **Nueva Regla**
3. Selecciona métrica, condición y umbral
4. Define severidad y mensaje
5. Las alertas aparecen automáticamente

### Exportación

1. En el Dashboard, click en **Exportar**
2. Selecciona formato (CSV, JSON, PNG, SVG)
3. El archivo se descarga automáticamente

### Zoom y Pan

1. Usa la rueda del mouse sobre el gráfico
2. Arrastra para mover
3. Click en **Reset** para volver

### Selector de Métricas

1. Click en **Seleccionar métricas**
2. Busca o selecciona métricas
3. Los gráficos se filtran automáticamente

### Replay

```tsx
import { ReplayControls } from '@/components/ui/ReplayControls';

<ReplayControls metrics={historicalMetrics} speed={2} loop />
```

### Predicciones

```tsx
import { linearRegression } from '@/utils/predictions';

const predictions = linearRegression(metrics, 10, 60000);
```

### Webhooks

```tsx
import { sendWebhook, createAlertWebhookPayload } from '@/utils/webhooks';

const payload = createAlertWebhookPayload(alert);
await sendWebhook(webhookConfig, payload);
```

## 📝 Notas

- **Three.js**: Instalar con `npm install three @types/three` para gráficos 3D
- **Persistencia**: Alertas, dashboards y anotaciones se guardan en localStorage
- **Performance**: El sistema de alertas está optimizado para no afectar el rendimiento

## 🔮 Próximas Mejoras Sugeridas

- Drag & drop visual para widgets
- Editor visual de dashboards
- Más tipos de gráficos (Pie, Scatter, etc.)
- Exportación programada
- Dashboard compartido (URLs públicas)
- Autenticación y usuarios
- API REST para configuración
