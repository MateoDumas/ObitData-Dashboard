# 🚀 Despliegue Rápido - ObitData Dashboard

## Tu Repositorio
```
https://github.com/MateoDumas/ObitData-Dashboard.git
```

## URL del Dashboard (después del deploy)
```
https://mateodumas.github.io/ObitData-Dashboard/
```

## Pasos Rápidos

### 1. Subir código a GitHub

```bash
# Si es la primera vez
git init
git add .
git commit -m "Initial commit - ObitData Dashboard"
git branch -M main
git remote add origin https://github.com/MateoDumas/ObitData-Dashboard.git
git push -u origin main

# Si ya tienes el repo configurado
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

### 2. Habilitar GitHub Pages

1. Ve a: https://github.com/MateoDumas/ObitData-Dashboard/settings/pages
2. En "Source", selecciona **"GitHub Actions"**
3. Click en **"Save"**

### 3. Esperar el despliegue

1. Ve a: https://github.com/MateoDumas/ObitData-Dashboard/actions
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera 2-3 minutos
4. Cuando termine, tu dashboard estará en:
   ```
   https://mateodumas.github.io/ObitData-Dashboard/
   ```

## ✅ Verificación

Después del despliegue, verifica:
- ✅ La app carga en la URL
- ✅ Las rutas funcionan (Dashboard, Analytics, Settings)
- ✅ Los gráficos se renderizan
- ✅ El dark mode funciona
- ✅ Los datos mock se generan

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Actualización del dashboard"
git push
```

El despliegue se hará automáticamente en 2-3 minutos.

## 📝 Notas

- El base path ya está configurado: `/ObitData-Dashboard/`
- No necesitas servidor - los datos mock funcionan perfectamente
- El workflow se ejecuta automáticamente en cada push a `main`
