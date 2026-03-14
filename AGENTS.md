# Agents

## Normas Generales

- **Context7**: Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Commands

- `pnpm start` - Start Expo development server
- `pnpm run android` - Run on Android
- `pnpm run ios` - Run on iOS
- `pnpm run web` - Run web version
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Jest tests

## Project Structure

- `app/` - Expo Router screens and pages
- `api/` - Express backend server with MongoDB
- `components/` - Reusable UI components
- `store/` - Zustand state stores
- `hooks/` - Custom React hooks
- `services/` - Push notifications and other services

## Tech Stack

- Expo (SDK 51) with React Native
- Zustand for state management
- TanStack Query for data fetching
- MongoDB backend
- Firebase Cloud Messaging for push notifications
- Google Sign-In authentication

## Arquitectura de Desarrollo

Este proyecto sigue una arquitectura basada en **stores** (Zzustand) y **hooks** personalizados. Es obligatorio seguir esta arquitectura para cualquier nueva funcionalidad siempre y cuando haga sentido segun la estructura del proyecto.

### Stores (Zustand)

Los stores se encuentran en `store/` y contienen el estado global de la aplicación. Cada store debe seguir la convención de nomenclatura `useNombreStore.ts`.

#### Stores existentes:

| Store                           | Archivo                         | Descripción                                                                              |
| ------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `useUserStore`                  | `store/useUserStore.ts`         | Gestiona el usuario autenticado, sus settings (notificaciones, stock) y estado de sesión |
| `useSummaryStore`               | `store/useSummaryStore.ts`      | Controla los contadores de sumas/restas en detalle de producto                           |
| `useSelectedValuesFormatPicker` | `store/useSelectedIdProduct.ts` | Maneja el ID de producto seleccionado y valores del picker de formato                    |

#### Cómo crear un nuevo store:

```typescript
// store/useNuevoStore.ts
import { create } from "zustand";

interface NuevoStore {
  // Estado
  valor: string;
  // Acciones
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
