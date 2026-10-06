# Prueba Técnica · Desarrollador React Native espartano

**Entrega:** lunes 28 de septiembre de 2026, 8:00 a.m. (hora Colombia)
**Tiempo de la prueba:** 1 h 30 min (después de 30 min de lectura y preparación)
**Obligatorio:** usar IA y usar OpenSpec para correr el ciclo SDD completo

---

## El caso

El equipo funcional te entrega el insumo del MVP de **ClaseFit**, una app para que los socios de un gimnasio reserven clases desde el celular. Está en `insumo-funcional/`:

- `insumo_funcional_ClaseFit.md`: historias, criterios y 4 reglas de negocio.
- `mock-data/clases.json`: los datos.

Tu trabajo es llevarlo **desde la especificación hasta una app lista para publicar**, siguiendo SDD con OpenSpec.

## Stack

- **React Native con Expo** y **TypeScript**.
- Datos locales (reservas en memoria; AsyncStorage es bonus).
- Pruebas con Jest.

---

## Lo que tienes que hacer

Tiempos sugeridos para que te alcance la 1 h 30 min. Haz **un commit al cerrar cada fase**.

### Fase 1 · Setup y contexto · *~10 min*
1. Crea el proyecto Expo con TypeScript e inicializa OpenSpec (`openspec init`).
2. Completa el contexto (`openspec/project.md` o equivalente) en pocas líneas: stack, estructura de carpetas, cómo correr pruebas.

### Fase 2 · Proposal, spec, design y tasks · *~20 min*
3. Crea un cambio (sugerido: `add-class-booking`) a partir del insumo.
4. `proposal.md` con **Why, What Changes e Impact**.
5. Spec delta (sugerido: `specs/class-booking/spec.md`). **Cada regla RN-01 a RN-04 debe estar cubierta por un requisito con escenarios.**
6. `design.md` breve (usa `plantillas/design.md`): estructura, manejo de estado, cómo calculas las fechas y una alternativa que descartaste.
7. `tasks.md` con el plan en pasos pequeños.
8. `openspec validate` sin errores.

### Fase 3 · Apply y verify · *~40 min*
9. Implementa tarea por tarea con tu asistente y marca `tasks.md`.
10. Pantallas mínimas: **Próximas clases** (con botón de reservar) y **Mis reservas** (con cancelar).
11. Lógica de negocio separada de la UI.
12. **Pruebas unitarias de las 4 reglas**, derivadas de los escenarios de tu spec. Deben pasar.

### Fase 4 · Archive y release · *~15 min*
13. Archiva el cambio (`openspec archive <id>`).
14. Configura `app.json` con nombre, versión, `android.package` e `ios.bundleIdentifier` (ej. `com.keppri.clasefit.<tunombre>`).
15. Crea `eas.json` con perfiles `preview` y `production` (`eas build:configure`).
16. Completa `plantillas/checklist_release.md`: qué está listo y qué falta para publicar en Google Play y App Store.
17. **Bonus:** lanza `eas build --platform android --profile preview` y comparte el enlace del APK.

### Fase 5 · Bitácora y reflexión · *~5 min + lo que vayas anotando*
18. Ve llenando `plantillas/bitacora_ia.md` durante la prueba.
19. Responde `04_Preguntas_de_Reflexion.md` en `respuestas_reflexion.md`.

---

## Entregables

```
tu-repo/
├── README.md                ← cómo correr la app y las pruebas
├── bitacora_ia.md
├── respuestas_reflexion.md
├── checklist_release.md
├── app.json
├── eas.json
├── src/ (o app/)
├── __tests__/ (o junto al código)
└── openspec/
    ├── project.md
    ├── specs/class-booking/spec.md      ← tras archivar
    └── changes/archive/...
```

**Bonus:** enlace al APK y/o un video de 1 a 2 minutos mostrando la app.

## En qué nos vamos a fijar

- Que hayas **recorrido todo el ciclo SDD** y se note en el repo y en los commits.
- Que la spec refleje el insumo y cubra las 4 reglas.
- Que las reglas estén separadas de la UI y probadas.
- Que la app funcione y quede lista para publicar.
- Cómo dirigiste a la IA y qué detectaste que hizo mal.
- Que puedas **explicar y defender** tu trabajo en la entrevista.

Simple, correcto, probado y trazable vale más que bonito.
