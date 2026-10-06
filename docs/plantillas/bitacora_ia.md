# Bitácora de uso de IA

## Herramientas que usé

- **OpenSpec CLI**: inspeccioné la raíz y el contexto del proyecto, creé el cambio `add-class-booking`, consulté las instrucciones de cada artefacto y ejecuté la validación estricta.
- **Terminal (`sed`, `rg`, `find`, `git status`)**: revisé el documento funcional, los datos simulados, la estructura del proyecto y los archivos generados sin modificar código de la aplicación.
- **Edición mediante parches**: creé y corregí los artefactos Markdown conservando los cambios existentes del repositorio.
- **TypeScript (`npx tsc --noEmit`)**: confirmé que el proyecto continuaba compilando después de generar la documentación.
- **Expo CLI (`npx expo lint`)**: intenté ejecutar el lint requerido por el proyecto; detecté que ESLint todavía no estaba configurado y evité conservar la instalación automática fuera del alcance.
- **Documentación oficial de Expo SDK 57 y React Native 0.86**: confirmé versiones, configuración de Jest, Expo Router, ESLint y el componente `Modal` antes de implementar.
- **Jest con `jest-expo`**: ejecuté 35 pruebas unitarias sobre fechas, disponibilidad, reservas, cancelaciones, mensajes, severidades y estado en memoria.
- **Expo Export**: generé bundles para iOS, Android y web para comprobar que las rutas y componentes compilan en las tres plataformas.
- **Navegador automatizado**: recorrí el catálogo y “Mis reservas” en vista móvil, verifiqué modo oscuro, mensajes, límite diario y confirmación de cancelación.
- **Vista previa web móvil**: verifiqué el toast de RN-02 con el catálogo desplazado hasta la parte inferior, comprobando su posición superpuesta, el texto accesible y que el intento duplicado no alterara el cupo.
- **Validación visual por severidad**: comprobé en viewport móvil los toasts verde de éxito, amarillo de advertencia y rojo de error, sus etiquetas accesibles, cierre, posición flotante y funcionamiento tanto en catálogo como en “Mis reservas”.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | Análisis funcional | "Analiza `docs/insumo-funcional/insumo_funcional_ClaseFit.md` y úsalo como fuente funcional de verdad para el MVP ClaseFit." | Alcance, actor, historias de usuario, reglas de negocio, mensajes y exclusiones claramente delimitados. |
| 2 | Propuesta OpenSpec | "Crea el cambio OpenSpec `add-class-booking` y genera `proposal.md`, `specs/class-booking/spec.md`, `design.md` y `tasks.md`, sin implementar código." | Un cambio de planificación completo, preparado para revisión e implementación posterior. |
| 3 | Cobertura funcional | "Cubre HU-01, HU-02 y HU-03, y crea escenarios explícitos y verificables para RN-01 a RN-04 conservando los mensajes definidos." | Una especificación trazable con escenarios positivos, negativos y mensajes literales. |
| 4 | Caso límite temporal | "Considera especialmente la regla de cancelación de dos horas y usa `diaOffset` con la zona horaria `America/Bogota`." | Se documentó que cancelar exactamente dos horas antes está permitido y que cualquier anticipación menor se rechaza. |
| 5 | Diseño técnico | "Usa Expo, React Native y TypeScript; separa la lógica de negocio de la UI para probarla con Jest; guarda reservas en memoria y usa el mock de clases." | Diseño con dominio puro, reloj inyectable, estado compartido en memoria y tareas de pruebas unitarias. |

### Ajuste posterior de RN-02

| Prompt | Qué obtuve |
|---|---|
| "El mensaje de error indicando que la reserva ya existe debe ser un toast, porque al hacer scroll podría no verse." | Se actualizó la especificación, el diseño y las tareas; después se implementó un toast accesible fuera del `ScrollView`, visible independientemente de la posición del catálogo. |

### Generalización de la retroalimentación

| Prompt | Qué obtuve |
|---|---|
| "Cualquier mensaje debe ser flotante y manejar rojo para error, amarillo para warning y verde para success." | Se conservaron las tareas históricas y se agregó un nuevo incremento OpenSpec. La implementación usa severidades tipadas, un toast compartido entre pantallas y etiquetas visibles y accesibles que no dependen únicamente del color. |

## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | Escribió los requisitos normativos solo con la palabra española “DEBE”. El validador estricto de OpenSpec busca además `MUST` o `SHALL`. | `openspec validate add-class-booking --strict` reportó una advertencia por cada requisito nuevo. | Se conservó el texto en español y se agregó la equivalencia RFC 2119 `MUST` o `MUST NOT` en cada requisito. |
| 2 | Ejecutó `npx expo lint` en un proyecto sin ESLint configurado; Expo intentó instalar dependencias automáticamente, lo cual excedía el alcance de solo planificación. | La salida indicó “No ESLint config found” y `git status` mostró cambios no deseados en `package.json`. | Se retiraron las dependencias agregadas automáticamente y se verificó que no quedaran cambios en `package.json` ni `package-lock.json`. La configuración de lint quedó como tarea de implementación. |
| 3 | Una inspección usó el patrón `bun.lock*` en `zsh`; al no existir coincidencias, el shell detuvo ese comando con `no matches found`. | La terminal mostró `zsh: no matches found: bun.lock*`. | Se comprobó después el gestor de paquetes listando los archivos del proyecto; existe `package-lock.json`, por lo que corresponden comandos con `npx`. |
| 4 | El primer parche de interfaz intentó modificar `app-tabs.web.tsx` varias veces dentro de la misma operación. | La herramienta rechazó el parche antes de aplicar cambios parciales. | Se reorganizó la edición para modificar cada archivo una sola vez por parche. |
| 5 | El lint inicial reveló un `setState` síncrono dentro de un efecto en el hook web heredado del starter. | `npx expo lint` señaló `react-hooks/set-state-in-effect` en `use-color-scheme.web.ts`. | Se reemplazó el efecto por `useSyncExternalStore`, conservando el comportamiento seguro para render estático y dejando lint sin errores. |
| 6 | El servidor de desarrollo de Expo no terminó de iniciar durante la verificación del toast en el entorno sin red. | El proceso quedó esperando después de informar que la red estaba deshabilitada y no abrió el puerto solicitado. | Se generó una exportación web local con Expo, se sirvió temporalmente en `127.0.0.1` y se completó la prueba móvil sobre ese bundle. |

## Resultado de `openspec validate`
```
Change 'add-class-booking' is valid
- Loading change status...
Change: add-class-booking
Schema: spec-driven
Change root: /Users/dlucumi/Documents/keppri-gym/openspec/changes/add-class-booking
Progress: 4/4 artifacts complete

[x] proposal
[x] specs
[x] design
[x] tasks

All planning artifacts complete!
Next: openspec instructions apply --change "add-class-booking" --json
```
