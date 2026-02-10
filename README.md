# 📊 ObitData Dashboard

<div align="center">
  <img src="public/logo.svg" alt="ObitData Logo" width="300" />
  <br/>
  <br/>

  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![D3.js](https://img.shields.io/badge/D3.js-7.8-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)

  <p align="center">
    <strong>Dashboard analítico de alto rendimiento para visualización de métricas en tiempo real.</strong>
    <br />
    <a href="https://mateodumas.github.io/ObitData-Dashboard/">Ver Demo en Vivo</a>
  </p>
</div>

---

## 💡 Sobre el Proyecto

**ObitData** es una plataforma de visualización de datos diseñada para manejar flujos de información en tiempo real con una interfaz moderna y reactiva. Construido con las últimas tecnologías del ecosistema React, este dashboard demuestra capacidades avanzadas de manejo de estado, optimización de renderizado y visualización de datos complejos.

El objetivo principal es proporcionar a los analistas y tomadores de decisiones una herramienta robusta para monitorear KPIs, detectar anomalías mediante alertas configurables y explorar tendencias históricas con herramientas de análisis profundo.

## 🚀 Características Principales

### ⚡ Core & Performance
- **Streaming en Tiempo Real**: Arquitectura basada en WebSockets (simulados) para actualizaciones instantáneas sin recargas.
- **Estado Global Optimizado**: Gestión de estado eficiente con **Zustand** para minimizar re-renders innecesarios.
- **Modo Oscuro/Claro**: Adaptabilidad total de la interfaz con persistencia de preferencias.

### 📈 Visualización Avanzada
- **Gráficos Interactivos**: Implementaciones customizadas usando **D3.js** y **Recharts**.
  - Zoom y Pan fluido en series temporales.
  - Gráficos 3D interactivos (Three.js).
  - Heatmaps temporales para detección de patrones.
- **Comparación de Datos**: Herramientas para contrastar métricas entre diferentes periodos de tiempo.

### 🔔 Monitoreo Inteligente
- **Sistema de Alertas**: Motor de reglas configurable (>, <, =, etc.) con umbrales personalizados.
- **Notificaciones Multimedia**: Feedback visual y sonoro ante eventos críticos.
- **Live Indicator**: Monitor de estado de conexión y latencia.

### 🛠 Herramientas de Análisis
- **Replay Histórico**: Funcionalidad tipo "DVR" para reproducir eventos pasados y analizar incidentes.
- **Predicciones (ML Básico)**: Algoritmos de regresión lineal y suavizado exponencial para proyección de tendencias.
- **Exportación Flexible**: Descarga de reportes en CSV, JSON, y capturas de gráficos en PNG/SVG.

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS, CLSX
- **Visualización**: D3.js, Three.js
- **Estado**: Zustand
- **Router**: React Router DOM
- **Iconos**: Lucide React

## 📦 Instalación y Desarrollo

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/MateoDumas/ObitData-Dashboard.git
   cd ObitData-Dashboard
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

## 🚀 Despliegue (CI/CD)

El proyecto cuenta con integración continua mediante **GitHub Actions** para despliegue automático en GitHub Pages.

### Opción Automática (Recomendada)
Cada push a la rama `main` dispara el workflow de despliegue configurado en `.github/workflows/deploy.yml`.

### Opción Manual
```bash
npm run deploy
```

---

<div align="center">
  Desarrollado con ❤️ por <strong>Mateo Dumas</strong>
</div>
