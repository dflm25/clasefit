# Bitácora de uso de IA · ClaseFit

## Objetivo

Usé IA como apoyo para convertir el insumo funcional de ClaseFit en una aplicación Expo con especificaciones trazables, reglas de negocio probadas y configuración inicial de release. Mantuve el documento funcional como fuente de verdad y revisé cada resultado antes de incorporarlo.

## Herramientas utilizadas

- **OpenSpec CLI:** creación, consulta, validación, aplicación, sincronización y archivo del cambio `add-class-booking`.
- **Codex:** análisis del insumo, redacción de artefactos OpenSpec, implementación, revisión y documentación.
- **Terminal y Git:** inspección del repositorio, ejecución de comandos y commits por fase.
- **Documentación oficial de Expo SDK 57 y React Native 0.86:** verificación de APIs, configuración, accesibilidad y compatibilidad.
- **Jest con `jest-expo`:** pruebas de fechas, disponibilidad, reservas, cancelaciones, mensajes, severidades y estado en memoria.
- **Expo CLI y TypeScript:** lint, comprobación de tipos, diagnóstico y generación de bundles.
- **Navegador automatizado:** validación móvil de navegación, reglas, confirmación de cancelación y mensajes flotantes.

## Prompts más importantes

| # | Etapa | Prompt resumido | Resultado |
|---|---|---|---|
| 1 | Análisis | “Analiza el insumo funcional de ClaseFit y úsalo como fuente de verdad.” | Se delimitó el MVP, las historias HU-01 a HU-03, las reglas RN-01 a RN-04 y las exclusiones. |
| 2 | Planificación | “Crea el cambio OpenSpec `add-class-booking` con proposal, spec, design y tasks.” | Se obtuvo un plan trazable antes de implementar código. |
| 3 | Reglas | “Cubre cada regla con escenarios explícitos, los mensajes exactos y el borde de dos horas.” | Se documentaron casos positivos, rechazos y límites temporales verificables. |
| 4 | Implementación | “Aplica `add-class-booking` manteniendo la lógica separada de la UI y probada con Jest.” | Se implementaron las dos pantallas, el estado en memoria y el dominio comprobable. |
| 5 | Retroalimentación | “Haz flotantes todos los mensajes y usa verde para success, amarillo para warning y rojo para error.” | Se creó un toast compartido, accesible y tipado por severidad, visible fuera del `ScrollView`. |

## Decisiones y cambios durante el proceso

- Inicialmente el error de reserva duplicada se mostraba dentro del contenido desplazable. Detecté que podía quedar fuera de la vista y pedí convertirlo en un toast.
- Después generalicé la decisión para que todos los mensajes operativos fueran flotantes y tuvieran severidad visual.
- Conservé el historial de OpenSpec: no reescribí la tarea 6.1 ya completada; agregué las tareas 7.1 a 7.3 para representar el nuevo incremento.
- No agregué backend, autenticación, pagos, notificaciones ni AsyncStorage porque estaban fuera del alcance.
- Mantuve `diaOffset`, `America/Bogota` y el mock oficial como fuentes del comportamiento temporal y de las clases.
- Sincronicé la delta spec antes de archivar, creando la especificación principal de `class-booking`.

## Errores o problemas detectados

| Problema | Cómo se detectó | Solución |
|---|---|---|
| Los requisitos usaban únicamente “DEBE”, pero la validación estricta esperaba también `MUST` o `SHALL`. | `openspec validate add-class-booking --strict` mostró advertencias. | Conservé el español y agregué `MUST` o `MUST NOT`. |
| `npx expo lint` intentó configurar ESLint durante la fase de planificación. | La salida y `git status` mostraron cambios fuera del alcance de esa fase. | Retiré los cambios automáticos y trasladé la configuración a la fase de implementación. |
| Una búsqueda con `bun.lock*` falló en `zsh` al no existir coincidencias. | La terminal mostró `no matches found`. | Verifiqué el gestor mediante los archivos reales; el proyecto usa npm y `package-lock.json`. |
| Un parche intentó modificar el mismo archivo varias veces en una sola operación. | La herramienta rechazó el parche sin aplicar cambios parciales. | Reorganicé la edición para modificar cada archivo una sola vez por parche. |
| El lint detectó un `setState` síncrono dentro de un efecto heredado del starter. | La regla `react-hooks/set-state-in-effect` reportó el hook web. | Reemplacé el efecto por `useSyncExternalStore`. |
| El servidor de Expo no terminó de iniciar durante una comprobación sin red. | El proceso no abrió el puerto solicitado. | Generé una exportación web local y validé el flujo sobre ese bundle. |

## Verificaciones realizadas

- OpenSpec: 24 de 24 tareas completadas antes del archive.
- Spec principal `class-booking`: sincronizada y validada.
- Jest: 35 de 35 pruebas aprobadas.
- ESLint: sin errores.
- TypeScript: sin errores.
- Bundles: iOS, Android y web generados correctamente.
- Validación visual: catálogo, reservas, cancelación, modo oscuro y toasts verde, amarillo y rojo.
- Git: commits separados para contexto, planificación, implementación, archive y configuración de release.

## Estado de release

- `app.json` configurado con nombre, versión e identificadores nativos.
- `eas.json` configurado con perfiles `development`, `preview` y `production`.
- README actualizado con instalación, ejecución, pruebas y builds.
- La generación y publicación de un build EAS permanece como actividad opcional; no se registra un enlace porque todavía no se ha comprobado un build remoto.

## Resultado

La IA aceleró el análisis, la escritura y la implementación, pero cada resultado se contrastó con el insumo funcional, OpenSpec, pruebas automatizadas, herramientas estáticas y validación manual. Las decisiones de alcance y experiencia de usuario se mantuvieron bajo revisión humana.
