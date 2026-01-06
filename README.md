# ObitData Dashboard

Dashboard en tiempo real para visualización de métricas con React + Vite + TypeScript.

## 🚀 Características

### Core
- **Datos en streaming**: WebSocket para actualizaciones en tiempo real
- **Visualizaciones interactivas**: Gráficos con D3.js (Line, Bar, HeatMap)
- **UI reactiva**: Actualización automática de componentes
- **Dark/Light mode**: Tema claro y oscuro
- **Indicador Live**: Estado de conexión en tiempo real
- **Arquitectura escalable**: Store con Zustand, hooks personalizados

### Alertas y Monitoreo
- **Sistema de alertas**: Reglas configurables con umbrales
- **Notificaciones visuales**: Panel de alertas en tiempo real
- **Sonidos de alerta**: Notificaciones audibles por severidad
- **Múltiples condiciones**: Mayor que, menor que, igual, etc.

### Visualización Avanzada
- **Zoom y Pan**: Interactividad avanzada en gráficos
- **Comparación de períodos**: Comparar rangos temporales lado a lado
- **Gráficos 3D**: Visualizaciones 3D con Three.js (opcional)
- **HeatMap temporal**: Visualización de patrones temporales

### Exportación y Análisis
- **Exportar datos**: CSV y JSON
- **Exportar gráficos**: PNG y SVG
- **Exportar datos de gráficos**: JSON estructurado

### Funcionalidades Avanzadas
- **Selector de métricas**: Búsqueda y filtrado de métricas
- **Replay de datos**: Reproducir datos históricos
- **Predicciones**: Regresión lineal y promedios móviles
- **Anotaciones**: Marcar eventos importantes en el tiempo
- **Múltiples dashboards**: Guardar y gestionar diferentes configuraciones
- **Modo fullscreen**: Para presentaciones
- **Webhooks**: Integración con sistemas externos

## 📦 Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 🚀 Despliegue en GitHub Pages

### Opción 1: GitHub Actions (Recomendado - Automático)

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a Settings → Pages
   - Source: GitHub Actions

2. **El workflow se ejecutará automáticamente:**
   - Cada push a `main` desplegará automáticamente
   - El workflow está en `.github/workflows/deploy.yml`

3. **Tu app estará disponible en:**
   ```
   https://mateodumas.github.io/ObitData-Dashboard/
   ```

### Opción 2: Deploy Manual

1. **Instala gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **El base path ya está configurado en `vite.config.ts`:**
   ```typescript
   base: '/ObitData-Dashboard/',
   ```

3. **Despliega:**
   ```bash
   npm run deploy
   ```

### URL de tu Dashboard

Tu dashboard estará disponible en:
```
https://mateodumas.github.io/ObitData-Dashboard/
```

El base path ya está configurado correctamente en `vite.config.ts`.

## 📁 Estructura del Proyecto

```
src/
├── api/              # WebSocket y API REST
├── components/       # Componentes React
│   ├── charts/      # Visualizaciones D3.js
│   ├── layout/      # Navbar, Sidebar, Layout
│   └── ui/          # Componentes UI básicos
├── hooks/           # Hooks personalizados
├── pages/           # Páginas principales
├── store/           # Estado global (Zustand)
├── utils/           # Utilidades y helpers
└── styles/          # Estilos globales
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

### WebSocket

El dashboard se conecta automáticamente al WebSocket configurado. El formato esperado de mensajes:

```json
{
  "id": "metric-id",
  "name": "Metric Name",
  "value": 42.5,
  "timestamp": 1234567890,
  "unit": "%",
  "category": "system"
}
```

O para batch:

```json
[
  { "id": "metric-1", "value": 10, ... },
  { "id": "metric-2", "value": 20, ... }
]
```

## 🎨 Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **D3.js** - Visualizaciones
- **Zustand** - Estado global
- **Tailwind CSS** - Estilos
- **React Router** - Navegación

## 📊 Componentes de Gráficos

- **LineChart**: Gráfico de líneas con animaciones
- **LineChartWithZoom**: Gráfico con zoom y pan interactivo
- **BarChart**: Gráfico de barras
- **HeatMap**: Mapa de calor temporal
- **ComparisonChart**: Comparación de períodos temporales
- **ThreeChart**: Gráficos 3D con Three.js (requiere `npm install three`)

## 🔧 Hooks Personalizados

- `useLiveData`: Maneja conexión WebSocket
- `useMetrics`: Acceso a métricas del store
- `useResize`: Tracking de dimensiones
- `useReplay`: Reproducción de datos históricos
- `useFullscreen`: Control de modo pantalla completa

## 🎯 Componentes UI Adicionales

- `AlertPanel`: Panel de alertas en tiempo real
- `AlertRulesManager`: Gestor de reglas de alertas
- `MetricSelector`: Selector y búsqueda de métricas
- `ExportButton`: Exportación de datos y gráficos
- `ReplayControls`: Controles de reproducción

## 📦 Stores Adicionales

- `alerts.store`: Sistema de alertas y reglas
- `annotations.store`: Anotaciones en gráficos
- `dashboards.store`: Múltiples dashboards guardados

## 🎨 Funcionalidades Detalladas

### Sistema de Alertas
1. Ve a **Settings** → **Reglas de Alertas**
2. Crea reglas con condiciones (>, <, >=, <=, =)
3. Define umbrales y severidad (info, warning, error, critical)
4. Las alertas aparecen automáticamente cuando se disparan

### Exportación
- **CSV/JSON**: Exporta métricas para análisis externo
- **PNG/SVG**: Exporta gráficos como imágenes
- Usa el botón "Exportar" en el Dashboard

### Zoom y Pan
- Usa la rueda del mouse para hacer zoom
- Arrastra para mover el gráfico
- Botón "Reset" para volver a la vista original

### Replay de Datos
- Reproduce datos históricos a velocidad configurable
- Útil para análisis y presentaciones

### Predicciones
- Regresión lineal para tendencias
- Promedios móviles
- Suavizado exponencial

## 🔌 Integración Webhooks

```typescript
import { sendWebhook, createAlertWebhookPayload } from '@/utils/webhooks';

// Envío de webhook cuando se dispara una alerta
const payload = createAlertWebhookPayload(alert);
await sendWebhook(webhookConfig, payload);
```

## 📝 Licencia

MIT
