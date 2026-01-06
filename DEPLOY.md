# 🚀 Guía de Despliegue en GitHub Pages

## Preparación

### 1. Verificar configuración

El `vite.config.ts` ya está configurado correctamente:

```typescript
base: process.env.NODE_ENV === 'production' ? '/ObitData-Dashboard/' : '/',
```

✅ **Ya está configurado para tu repositorio: `ObitData-Dashboard`**

### 2. Configurar el repositorio

1. Tu repositorio ya existe: `https://github.com/MateoDumas/ObitData-Dashboard.git`
2. Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ObitData Dashboard"
   git branch -M main
   git remote add origin https://github.com/MateoDumas/ObitData-Dashboard.git
   git push -u origin main
   ```

## Método 1: GitHub Actions (Automático) ⭐ Recomendado

### Pasos:

1. **Habilita GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - En "Source", selecciona **"GitHub Actions"**

2. **El workflow ya está configurado:**
   - El archivo `.github/workflows/deploy.yml` está listo
   - Se ejecutará automáticamente en cada push a `main`

3. **Espera el despliegue:**
   - Ve a la pestaña "Actions" en tu repositorio
   - Verás el workflow ejecutándose
   - Cuando termine, tu app estará disponible en:
     ```
     https://mateodumas.github.io/ObitData-Dashboard/
     ```

### Ventajas:
- ✅ Automático en cada push
- ✅ No necesitas instalar nada extra
- ✅ Historial de despliegues en GitHub Actions

## Método 2: Deploy Manual

### Pasos:

1. **Instala gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Actualiza package.json:**
   El script `deploy` ya está configurado:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **Configura git (si no lo has hecho):**
   ```bash
   git config user.name "Tu Nombre"
   git config user.email "tu@email.com"
   ```

4. **Despliega:**
   ```bash
   npm run deploy
   ```

5. **Habilita GitHub Pages:**
   - Ve a Settings → Pages
   - Source: `gh-pages` branch
   - Save

### Ventajas:
- ✅ Control total sobre cuándo desplegar
- ✅ Puedes desplegar desde tu máquina local

## Solución de Problemas

### La app no carga / Página en blanco

**Problema:** El base path no coincide con el nombre del repositorio.

**Solución:**
1. El nombre de tu repositorio es: `ObitData-Dashboard`
2. El `vite.config.ts` ya está configurado correctamente:
   ```typescript
   base: '/ObitData-Dashboard/',
   ```
3. Si aún hay problemas, reconstruye y redespliega

### Rutas no funcionan (404)

**Problema:** GitHub Pages no soporta SPA routing por defecto.

**Solución:** Crea un archivo `404.html` en `public/`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ObitData Dashboard</title>
    <script>
      // Single Page Apps for GitHub Pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### Variables de entorno

**Problema:** Las variables de entorno no funcionan en producción.

**Solución:** 
- Las variables `VITE_*` se inyectan en build time
- Para GitHub Pages, puedes hardcodear valores en `vite.config.ts` o usar valores por defecto

## Verificación Post-Despliegue

1. ✅ La app carga correctamente
2. ✅ Las rutas funcionan (Dashboard, Analytics, Settings)
3. ✅ Los gráficos se renderizan
4. ✅ El dark mode funciona
5. ✅ Los datos mock se generan

## Actualizaciones Futuras

Cada vez que hagas cambios:

**Con GitHub Actions:**
- Simplemente haz `git push` y se desplegará automáticamente

**Con deploy manual:**
- `npm run deploy` después de tus cambios

## Notas Importantes

- ⚠️ GitHub Pages solo sirve archivos estáticos
- ⚠️ No puedes usar WebSocket en GitHub Pages (usa datos mock)
- ⚠️ El base path debe coincidir exactamente con el nombre del repo
- ✅ Los datos mock funcionarán perfectamente
- ✅ Todas las funcionalidades del dashboard estarán disponibles
