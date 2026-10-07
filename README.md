# ClaseFit

Aplicación móvil para consultar, reservar y cancelar clases grupales de un gimnasio. El MVP fue desarrollado con Expo, React Native y TypeScript siguiendo un flujo SDD con OpenSpec.

## Demostración

Puedes ver la aplicación funcionando en el siguiente video:

[![Demostración de ClaseFit](https://img.youtube.com/vi/gUwMPDnIzp8/hqdefault.jpg)](https://youtube.com/shorts/gUwMPDnIzp8?feature=share)

## Funcionalidades

- Consulta de clases de hoy, mañana y pasado mañana.
- Fechas calculadas mediante `diaOffset` en la zona horaria `America/Bogota`.
- Clases ordenadas cronológicamente y exclusión de las que ya comenzaron.
- Reserva de clases con actualización inmediata de cupos.
- Listado y cancelación de reservas activas.
- Límite máximo de dos reservas por día.
- Cancelación permitida hasta exactamente dos horas antes del inicio.
- Mensajes flotantes accesibles para resultados exitosos, advertencias y errores.
- Compatibilidad con modos claro y oscuro.

## Alcance del MVP

La aplicación utiliza exclusivamente datos locales de [clases.json](docs/insumo-funcional/mock-data/clases.json). Las reservas se almacenan en memoria y se pierden al reiniciar la aplicación.

No incluye autenticación, backend, pagos, notificaciones, administración, gestión de instructores ni persistencia con AsyncStorage.

## Tecnologías

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript
- Expo Router
- Jest con `jest-expo`
- OpenSpec

## Requisitos previos

- Node.js compatible con Expo SDK 57
- npm
- Expo Go, un simulador o un dispositivo configurado para ejecutar la aplicación

## Instalación

```bash
npm install
```

## Ejecución

Iniciar el servidor de desarrollo:

```bash
npx expo start
```

También se puede iniciar directamente para una plataforma:

```bash
npm run android
npm run ios
npm run web
```

## Verificación

Ejecutar las pruebas unitarias:

```bash
npm test -- --runInBand
```

Ejecutar lint:

```bash
npx expo lint
```

Comprobar TypeScript:

```bash
npx tsc --noEmit
```

Comprobar dependencias y configuración de Expo:

```bash
npx expo-doctor
```

Generar bundles locales de verificación para las plataformas soportadas:

```bash
npx expo export --platform all
```

## Estructura principal

```text
src/
├── app/                         # Rutas y pantallas de Expo Router
├── components/                  # Componentes reutilizables de presentación
├── constants/                   # Tokens y constantes visuales
├── features/class-booking/      # Dominio, estado y reglas de reservas
└── hooks/                       # Hooks compartidos

__tests__/                       # Pruebas unitarias con Jest
docs/                            # Insumo funcional, guía y bitácora
openspec/
├── specs/class-booking/         # Especificación principal sincronizada
└── changes/archive/             # Historial de cambios OpenSpec
```

La lógica de disponibilidad, reserva, cancelación y fechas permanece separada de las pantallas para poder probarse sin renderizar la interfaz.

## Reglas de negocio

- **RN-01:** no se puede reservar una clase sin cupos.
- **RN-02:** no se puede reservar dos veces la misma clase.
- **RN-03:** se permiten como máximo dos reservas por fecha de clase.
- **RN-04:** una reserva puede cancelarse hasta exactamente dos horas antes del inicio.

Los mensajes funcionales y sus escenarios verificables se encuentran en [la especificación de class-booking](openspec/specs/class-booking/spec.md).

## Configuración de la aplicación

La aplicación se identifica como `ClaseFit` y utiliza los siguientes identificadores nativos:

- iOS: `com.clasefit.dlucumi`
- Android: `com.clasefit.dlucumi`

La configuración de Expo está en [app.json](app.json), y los perfiles EAS `development`, `preview` y `production` están definidos en [eas.json](eas.json).

## Builds con EAS

Para iniciar un build interno de Android:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Para un build de producción:

```bash
npx eas-cli@latest build --platform all --profile production
```

Estos comandos requieren una cuenta de Expo, conexión a internet y credenciales válidas para cada plataforma. La presencia de la configuración EAS no implica que los builds o publicaciones en tiendas ya se hayan completado.

## Documentación

- [Insumo funcional](docs/insumo-funcional/insumo_funcional_ClaseFit.md)
- [Prueba técnica](docs/03_Prueba_Tecnica_React_Native.md)
- [Bitácora de uso de IA](docs/plantillas/bitacora_ia.md)
- [Checklist de release](docs/plantillas/checklist_release.md)

## Estado del proyecto

El ciclo funcional de OpenSpec para `add-class-booking` fue implementado, validado, sincronizado y archivado. La preparación de release continúa con la revisión del checklist y, opcionalmente, la generación de un build `preview`.
