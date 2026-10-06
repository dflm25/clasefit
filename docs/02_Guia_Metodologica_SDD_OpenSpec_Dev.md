# Guía metodológica · SDD con OpenSpec para el rol Técnico (React Native)

*Lectura estimada: 15 minutos.*

## 1. Qué es Spec-Driven Development (SDD)

El patrón que queremos evitar: abrir el asistente, escribir "hazme una app de reservas en React Native" y aceptar lo que salga. Funciona para una demo; en un proyecto real produce reglas inventadas, código que nadie entiende y cero trazabilidad. A eso le dicen *vibe coding*.

**SDD le da la vuelta:** primero se acuerda la especificación y después la IA y las personas construyen a partir de ella. La spec es **la fuente de verdad** del diseño, el código y las pruebas.

Para un desarrollador significa:

- **La IA trabaja con contexto preciso**, no adivinando.
- **Los escenarios de la spec se convierten casi directamente en pruebas.**
- **Cada pieza de código es trazable** a un requisito.
- **Pasas de escribir código a dirigir, revisar y verificar.**

## 2. El ciclo SDD completo

```
 Insumo funcional (del PO / BA)
      │
      ▼
 1. Proposal + 2. Specs      ── compuerta: ¿refleja el insumo?
      ▼
 3. Design + 4. Tasks        ── compuerta: ¿el plan cubre los escenarios?
      ▼
 5. Apply + 6. Verify        ── compuerta: pruebas en verde
      ▼
 7. Archive + 8. Release
```

En esta prueba **tú corres todo el ciclo**. El insumo funcional viene "masticado" (historias, reglas y criterios), pero no en formato OpenSpec: convertirlo es parte de tu trabajo.

## 3. Cómo cambia el rol del desarrollador

| Antes | En SDD con IA |
|---|---|
| Recibes una historia y la interpretas | La conviertes en spec y validas tu interpretación antes de codificar |
| Escribes la mayoría del código | Diriges a la IA tarea por tarea y revisas cada cambio |
| Las decisiones quedan en tu cabeza | Quedan en `design.md`, versionadas |
| Las pruebas se hacen "si da tiempo" | Salen de los escenarios de la spec |

## 4. OpenSpec en 5 minutos

**OpenSpec** es una herramienta de código abierto (de Fission AI) para hacer SDD con asistentes de IA. Vive dentro del repo, en Markdown.

```bash
npm install -g @fission-ai/openspec@latest
cd tu-proyecto
openspec init        # te pregunta qué asistente usas y configura sus comandos
```

> **Ojo con la versión.** Los comandos del asistente pueden ser `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` o `/opsx:propose`, `/opsx:apply`, `/opsx:archive`, y el contexto puede estar en `project.md` o `config.yaml`. **Sigue el README de tu versión.**

### Estructura

```
openspec/
├── project.md              ← stack, convenciones, restricciones
├── specs/                  ← verdad actual (se llena al archivar)
└── changes/<id-del-cambio>/
    ├── proposal.md
    ├── design.md
    ├── tasks.md
    └── specs/<capacidad>/spec.md
```

### Comandos CLI

```bash
openspec list
openspec show <id>
openspec validate <id>     # úsalo seguido
openspec archive <id>      # mueve las specs a openspec/specs/
```

### Flujo con el asistente

1. **Propuesta:** pides al asistente que cree el cambio desde el insumo. Genera proposal, spec delta y tasks.
2. **Revisas y ajustas.** Aquí más se equivoca la IA: inventa reglas o se salta casos borde.
3. **Design:** agregas tus decisiones técnicas (breves).
4. **Apply:** el asistente implementa las tareas y las marca `[x]` en `tasks.md`.
5. **Verify:** pruebas.
6. **Archive:** `openspec archive <id>`.

### Formato de spec

```markdown
## ADDED Requirements

### Requirement: Cancelar una reserva
El sistema SHALL permitir cancelar una reserva hasta 2 horas antes del inicio.

#### Scenario: Cancelación a tiempo
- **WHEN** el socio cancela una clase que empieza en más de 2 horas
- **THEN** la reserva se elimina
- **AND** el cupo se libera

#### Scenario: Cancelación tardía
- **WHEN** el socio intenta cancelar una clase que empieza en 2 horas o menos
- **THEN** el sistema no permite la cancelación
```

- `### Requirement:` con **SHALL** o **MUST**; al menos un `#### Scenario:` (cuatro `#`) con WHEN / THEN.

### Formato de `tasks.md`

```markdown
## 1. Reglas de negocio
- [ ] 1.1 Implementar validación de cupo
- [ ] 1.2 Pruebas unitarias de RN-01 a RN-04
```

## 5. Buenas prácticas con el asistente

1. **Llena `project.md`** con stack y convenciones: es el contexto que la IA lee siempre.
2. **Una tarea a la vez** y commit por fase.
3. **Pide las pruebas desde los escenarios**: "escribe pruebas que cubran cada Scenario de la spec".
4. **Revisa cada diff.** Si no entiendes algo, pregúntale o reescríbelo.
5. **Anota en la bitácora cuando la IA se equivoque.**

## 6. La parte de release

El ciclo no termina en "funciona en mi celular". Con **Expo + EAS** preparas la publicación:

```bash
npm install -g eas-cli
eas login                  # cuenta gratuita de Expo
eas build:configure        # crea eas.json
eas build --platform android --profile preview   # APK instalable (bonus)
```

En esta prueba lo obligatorio es dejar **la configuración de release lista** (`app.json` y `eas.json`) y la **checklist** de lo que falta para publicar en las tiendas. Lanzar el build es bonus: corre en la nube y puede tardar, así que lánzalo y sigue trabajando mientras termina.

## 7. Checklist antes de entregar

- ☐ Cambio de OpenSpec con proposal, spec, design y tasks.
- ☐ `openspec validate` sin errores.
- ☐ `tasks.md` marcado (o explicas lo que faltó).
- ☐ Reglas de negocio con pruebas en verde.
- ☐ Cambio archivado.
- ☐ `app.json`, `eas.json` y checklist de release.
- ☐ Commits por fase, bitácora y reflexión.
