# Bitácora de uso de IA

## Herramientas que usé

- **OpenSpec CLI**: inspeccioné la raíz y el contexto del proyecto, creé el cambio `add-class-booking`, consulté las instrucciones de cada artefacto y ejecuté la validación estricta.
- **Terminal (`sed`, `rg`, `find`, `git status`)**: revisé el documento funcional, los datos simulados, la estructura del proyecto y los archivos generados sin modificar código de la aplicación.
- **Edición mediante parches**: creé y corregí los artefactos Markdown conservando los cambios existentes del repositorio.
- **TypeScript (`npx tsc --noEmit`)**: confirmé que el proyecto continuaba compilando después de generar la documentación.
- **Expo CLI (`npx expo lint`)**: intenté ejecutar el lint requerido por el proyecto; detecté que ESLint todavía no estaba configurado y evité conservar la instalación automática fuera del alcance.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | Análisis funcional | "Analiza `docs/insumo-funcional/insumo_funcional_ClaseFit.md` y úsalo como fuente funcional de verdad para el MVP ClaseFit." | Alcance, actor, historias de usuario, reglas de negocio, mensajes y exclusiones claramente delimitados. |
| 2 | Propuesta OpenSpec | "Crea el cambio OpenSpec `add-class-booking` y genera `proposal.md`, `specs/class-booking/spec.md`, `design.md` y `tasks.md`, sin implementar código." | Un cambio de planificación completo, preparado para revisión e implementación posterior. |
| 3 | Cobertura funcional | "Cubre HU-01, HU-02 y HU-03, y crea escenarios explícitos y verificables para RN-01 a RN-04 conservando los mensajes definidos." | Una especificación trazable con escenarios positivos, negativos y mensajes literales. |
| 4 | Caso límite temporal | "Considera especialmente la regla de cancelación de dos horas y usa `diaOffset` con la zona horaria `America/Bogota`." | Se documentó que cancelar exactamente dos horas antes está permitido y que cualquier anticipación menor se rechaza. |
| 5 | Diseño técnico | "Usa Expo, React Native y TypeScript; separa la lógica de negocio de la UI para probarla con Jest; guarda reservas en memoria y usa el mock de clases." | Diseño con dominio puro, reloj inyectable, estado compartido en memoria y tareas de pruebas unitarias. |

## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | Escribió los requisitos normativos solo con la palabra española “DEBE”. El validador estricto de OpenSpec busca además `MUST` o `SHALL`. | `openspec validate add-class-booking --strict` reportó una advertencia por cada requisito nuevo. | Se conservó el texto en español y se agregó la equivalencia RFC 2119 `MUST` o `MUST NOT` en cada requisito. |
| 2 | Ejecutó `npx expo lint` en un proyecto sin ESLint configurado; Expo intentó instalar dependencias automáticamente, lo cual excedía el alcance de solo planificación. | La salida indicó “No ESLint config found” y `git status` mostró cambios no deseados en `package.json`. | Se retiraron las dependencias agregadas automáticamente y se verificó que no quedaran cambios en `package.json` ni `package-lock.json`. La configuración de lint quedó como tarea de implementación. |
| 3 | Una inspección usó el patrón `bun.lock*` en `zsh`; al no existir coincidencias, el shell detuvo ese comando con `no matches found`. | La terminal mostró `zsh: no matches found: bun.lock*`. | Se comprobó después el gestor de paquetes listando los archivos del proyecto; existe `package-lock.json`, por lo que corresponden comandos con `npx`. |

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
