# GLHF - Documentación del Proyecto

## Reglas de Estilo

**Nunca usar bun.** Usar siempre npm para instalar dependencias y ejecutar scripts.

**Siempre usar NativeWind (className) para UI.** No usar StyleSheet ni estilos inline.

```tsx
// ✅ Correcto
<View className="flex-1 bg-neutral-900 p-4">
  <Text className="text-white text-lg font-bold">Title</Text>
</View>

// ❌ Incorrecto
<View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
  <Text style={{ color: 'white', fontSize: 16 }}>Title</Text>
</View>
```

## Comandos para Desarrollar

### Frontend (Expo)
```bash
npm start          # Servidor de desarrollo Expo
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
npm run web        # Ejecutar versión web
npm run lint       # Run ESLint
npm test           # Run Jest tests
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

## Estructura del Proyecto

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
│   ├── services/              # Lógica de negocio
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
│   ├── ProductDetail/
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
├── 📁 assets/                  # Imágenes, fuentes
│
├── 📄 package.json             # Root (Expo)
├── 📄 api/package.json         # Backend
├── 📄 prisma/schema.prisma     # Modelos
├── 📄 app.config.js             # Config Expo
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 eas.json                  # EAS Build
└── 📄 google-services.json      # Firebase
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

## Arquitectura de Desarrollo

Este proyecto sigue una arquitectura basada en **stores** (Zustand) y **hooks** personalizados. Es obligatorio seguir esta arquitectura para cualquier nueva funcionalidad siempre y cuando haga sentido según la estructura del proyecto.

### Stores (Zustand)

Los stores se encuentran en `store/` y contienen el estado global de la aplicación. Cada store debe seguir la convención de nomenclatura `useNombreStore.ts`.

#### Stores existentes:

| Store                           | Archivo                         | Descripción                                                                              |
| ------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `useUserStore`                  | `store/useUserStore.ts`         | Gestiona el usuario autenticado, sus settings (notificaciones, stock) y estado de sesión |
| `useSummaryStore`               | `store/useSummaryStore.ts`      | Controla los contadores de sumas/restas en detalle de producto                           |
| `useSelectedValuesFormatPicker` | `store/useSelectedIdProduct.ts` | Maneja el ID de producto seleccionado y valores del picker de formato                    |
| `useSettingStore`               | `store/useSettingStore.ts`     | Configuraciones de la aplicación                                                         |

#### Cómo crear un nuevo store:

```typescript
// store/useNuevoStore.ts
import { create } from "zustand";

interface NuevoStore {
  valor: string;
  setValor: (value: string) => void;
}

export const useNuevoStore = create<NuevoStore>((set) => ({
  valor: "",
  setValor: (value) => set({ valor: value }),
}));
```

#### Reglas para stores:

- Usar siempre `create<Interfaz>` de Zustand
- Exportar con prefijo `use` (ej: `useUserStore`)
- Incluir tests en `store/__tests__/`
- Usar para estado global que necesita ser compartido entre múltiples componentes/pantallas

### Hooks Personalizados

Los hooks están en `hooks/` y encapsulan lógica de negocio, integración con APIs o utilerías.

#### Hooks existentes:

| Hook                 | Archivo                       | Descripción                                                   |
| -------------------- | ----------------------------- | ------------------------------------------------------------- |
| `useCategories`      | `hooks/useCategories.ts`      | Query y mutation para categorías (usa TanStack Query + store) |
| `useProducts`        | `hooks/useProducts.tsx`       | Query y mutation para productos                               |
| `useFilePdfDownload` | `hooks/useFilePdfDownload.ts` | Lógica de descarga y guardado de PDFs                         |
| `useColorScheme`     | `hooks/useColorScheme.ts`     | Re-export de React Native para tema oscuro                    |

#### Cómo crear un nuevo hook:

```typescript
// hooks/useNuevoHook.ts
import { useState } from "react";
import { useUserStore } from "../store/useUserStore";

export const useNuevoHook = () => {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const accion = async () => {
    // lógica...
  };

  return { accion, loading };
};
```

#### Reglas para hooks:

- Usar prefijo `use` en el nombre
- Ubicar en `hooks/`
- Pueden usar stores y otros hooks
- Para queries/mutations usar TanStack Query (`useQuery`, `useMutation`)
- Mantener lógica de presentación en componentes, lógica de negocio en hooks

### Components

Los componentes reutilizables van en `components/`. Los específicos de una pantalla pueden estar junto a la pantalla en `app/`.

### Relación entre capas

```
Pantalla (app/)
    ↓ usa
Hook (hooks/)
    ↓ usa
Store (store/) + TanStack Query + API
    ↓ gestiona
Estado global / Datos
```

### Cuándo usar cada cosa:

- **Store**: Estado global que múltiples componentes necesitan compartir (usuario, selección actual, configuración)
- **Hook**: Lógica reutilizable que no es estado (fetching, transformaciones, utilerías con estado)
- **Component**: UI reutilizable o específica de pantalla
- **Directamente en screen**: Estado local que solo esa pantalla usa (`useState`)