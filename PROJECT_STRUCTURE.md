# Estructura del Proyecto GLHF

## Estructura Completa del Proyecto

```
GLHF/
├── 📱 app/                    # Expo Router (pantallas)
│   ├── _layout.tsx            # Layout principal
│   ├── index.tsx              # Home
│   ├── AddCategory.tsx        # Agregar categoría
│   ├── AddProduct.tsx         # Agregar producto
│   ├── Products.tsx           # Lista de productos
│   ├── ProductDetail.tsx      # Detalle de producto
│   ├── ProductStockValues.tsx # Valores de stock
│   ├── SettingScreen.tsx      # Configuración
│   ├── NotificationSettingScreen.tsx
│   ├── api/                   # Rutas API locales
│   ├── lib/                   # Utilidades de screens
│   └── (tabs)/                # Navegación por tabs
│       └── _layout.tsx
│
├── ⚙️  api/                   # Backend Express + Prisma
│   ├── server.mjs             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos de BD
│   │   └── migrations/        # Migraciones
│   ├── routes/                # Rutas API
│   │   ├── auth.routes.mjs
│   │   ├── category.routes.mjs
│   │   ├── product.routes.mjs
│   │   ├── user.routes.mjs
│   │   ├── detail.routes.mjs
│   │   └── pdf.routes.mjs
│   ├── services/              # Lógica de negocio
│   │   ├── auth.service.mjs
│   │   ├── notification.service.mjs
│   │   └── summary.service.mjs
│   ├── middleware/            # Auth, validation, rate limit
│   ├── config/                # Configuración
│   ├── lib/                   # Prisma client, errors
│   ├── validators/            # Validaciones
│   ├── cron/                  # Tareas programadas
│   ├── database/              # Conexiones DB
│   └── __tests__/             # Tests
│
├── 🧩 components/              # Componentes reutilizables
│   ├── Button.tsx
│   ├── Logo.tsx
│   ├── SearchBar.tsx
│   ├── FormatPicker.tsx
│   ├── InfoModal.tsx
│   ├── categoriesScreen/
│   │   └── FilteredCategoriesList.tsx
│   ├── ProductDetail/
│   │   ├── SummarySquare.tsx
│   │   ├── MonthSelector.tsx
│   │   └── TransactionDayItem.tsx
│   ├── GoogleLogin/
│   └── navigation/
│
├── 📦 store/                  # Zustand stores
│   ├── useUserStore.ts        # Usuario y sesión
│   ├── useSummaryStore.ts      # Contadores suma/resta
│   ├── useSelectedIdProduct.ts # Producto seleccionado
│   ├── useSettingStore.ts      # Configuraciones
│   └── __tests__/
│
├── 🪝 hooks/                   # Custom hooks
│   ├── useCategories.ts        # Query categorías
│   ├── useProducts.tsx         # Query productos
│   ├── useColorScheme.ts        # Tema oscuro
│   └── useFilePdfDownload.ts    # Descarga PDFs
│
├── 🔔 services/                # Servicios
│   └── usePushNotifications.tsx # Push notifications
│
├── 📁 constants/               # Constantes
├── 📁 types/                   # Tipos TypeScript
├── 📁 utils/                   # Utilidades
├── 📁 assets/                   # Imágenes, fuentes
│
├── 📄 package.json             # Root (Expo)
├── 📄 api/package.json         # Backend
├── 📄 prisma/schema.prisma     # Modelos
├── 📄 app.config.js             # Config Expo
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 eas.json                  # EAS Build
├── 📄 google-services.json      # Firebase
└── 📄 AGENTS.md                # Instrucciones de arquitectura
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Expo SDK 51, React Native |
| **Navegación** | Expo Router (file-based) |
| **Estado** | Zustand |
| **Data Fetching** | TanStack Query |
| **Backend** | Express.js |
| **Base de Datos** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Auth** | Google Sign-In |
| **Push** | Firebase Cloud Messaging |
| **Estilos** | Tailwind CSS + NativeWind |

## Flujo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Screens   │────▶│   Hooks     │────▶│   Stores    │
│   (app/)    │     │  (hooks/)   │     │  (store/)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  TanStack   │
                   │   Query     │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐     ┌─────────────┐
                   │ Express API │────▶│  PostgreSQL │
                   │   (api/)    │     │   (Neon)    │
                   └─────────────┘     └─────────────┘
```

## Comandos para Desarrollar

### Frontend (Expo)
```bash
npm start          # Servidor de desarrollo Expo
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar versión web
```

### Backend (API)
```bash
cd api
npm install        # Instalar dependencias
npx prisma generate  # Generar Prisma Client
npm run dev        # Modo desarrollo
```

### Prisma (Base de datos)
```bash
cd api
npx prisma db push          # Sincronizar schema con BD
npx prisma studio           # UI para explorar datos
npx prisma migrate dev       # Crear migración (producción)
```

## Convenciones de Arquitectura

### Stores (Zustand)
- Ubicación: `store/useNombreStore.ts`
- Prefijo: `use` (ej: `useUserStore`)
- Usar para estado global compartido entre componentes

### Hooks
- Ubicación: `hooks/useNombreHook.ts`
- Prefijo: `use`
- Usar para lógica de negocio, fetching, utilerías

### Componentes
- Ubicación: `components/`
- Específicos de pantalla: junto a la pantalla en `app/`

### Flujo recomendado
```
Screen (app/) → Hook (hooks/) → Store (store/) + TanStack Query + API
```
