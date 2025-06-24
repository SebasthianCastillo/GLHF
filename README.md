# GLHF Inventory App

Aplicación móvil para gestión de inventario con backend en Node.js y MongoDB. Desarrollado con React Native y Expo.

---

## 📦 Versiones y Cambios

### ✅ v1.0

- a. Editar/eliminar categoría y producto manteniendo presionado (con confirmación)
- b. Vista de productos disponibles en detalle de producto (DIV)

### 🔄 v1.0.1 (pequeñas mejoras a la v1)

- a. Cambiar DownPicker por modal para seleccionar formato de productos

### 🚀 v1.1

- a. Cambio de color en botones de categoría al mantener presionado
- b. Buscador de productos por categoría 👷 _[En desarrollo]_
- c. Pull to refresh de productos
- d. Botón de recarga en vista de categorías
- e. Mejora en suma/resta de unidades (guardar tras unos segundos, no en cada incremento) 🔜 _[Planeado]_
- f. Fix: evitar cierre al hacer long click en dos productos consecutivamente

---

## 🧪 Convenciones de Commits

Se siguen las convenciones de commits propuestas en este artículo:

🔗 [Conventional Git Commits - Best Practices](https://dev.to/anikakash/conventional-git-commits-with-best-practices-4d2)

---

## 🌐 Despliegue Backend (Render)

Archivo principal del servidor: `~/Desktop/INVS/glhf/api/server.mjs`

### Estructura del proyecto:

```
INVS/
└── glhf/
    └── api/
        └── server.mjs
```

### Configuración en Render:

- **Root Directory:** `glhf/api`
- **Build Command:** `npm install` _(si hay `package.json`)_
- **Start Command:** `node server.mjs`

---

## 📱 Generar APK / AAB para Android (Expo + EAS)

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Iniciar sesión en Expo

```bash
eas login
```

### 3. Configurar EAS en el proyecto

```bash
eas build:configure
```

### 4. Generar build

- **APK:**

```bash
eas build -p android --profile preview
```

- **AAB (Play Store):**

```bash
eas build --platform android --profile preview
```

---

## Configuración de Debug (VS Code / Cursor)

### Pasos para debuggear:

1. Iniciar app:

```bash
npx expo start
```

2. Iniciar backend:

```bash
node server.mjs
```

3. Configurar `launch.json` en `.vscode`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/api/server.mjs",
      "cwd": "${workspaceFolder}/api",
      "runtimeArgs": ["--experimental-modules"]
    },
    {
      "name": "Attach to Hermes application",
      "request": "attach",
      "type": "reactnativedirect",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

---

## 🧾 Licencia

Este proyecto es privado y de uso interno. No redistribuir sin permiso.
